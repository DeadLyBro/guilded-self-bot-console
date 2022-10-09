# Guilded self-bot console

A simple Guilded Self-bot using console. Intended for quick scripts runnable directly from the devtools.

# Disclaimer

Automating user accounts is against [Guilded Terms of Use](https://support.guilded.gg/hc/en-us/articles/360039728313-Terms-of-Use). You might get banned if you abuse it (too much spam, unusual activity).

# Usage

1. Open Chrome devtools on Guilded using `Ctrl + shift + i`
2. Go to the console tab and paste the entire [`index.js`](./index.js) script
3. ...
4. Profit!

You can now use any function provided by this script in the console like `await api.someFunction()`. Don't forget `await` or the server's response will not be printed to the console.

Use the `id()` function to update the variable `sid` server id, `gid` guild id and `cid` channel id to what you are currently watching.

**Note:** It's a good idea to wrap your code in its own scope `{ code }` or you might get an error when reusing the same variable names later!

# Examples

## Basic example

Update `cid` to the channel you are watching, get the last 100 messages, send a message, edit then delete.

```js
{
  id()
  let channelId = cid

  // Send a message
  let sentMessage = await api.sendMessage(channelId, 'Hello!')

  await delay(2000)

  // Edit a message
  let editedMessage = await api.editMessage(channelId, sentMessage.message.id, 'Hello, edited!')

  await delay(2000)

  // Delete a message
  await api.deleteMessage(channelId, editedMessage.id)

  await delay(2000)

  // Log the last 100 messages
  let messages = await api.getMessages(channelId)
  console.log(messages)
}
```

## Automatic reply chat with some response

You can change `const search` and `let messages`

```js
{
    id();

    const channelId = cid;
    const serverId = sid;

    const search = [`Gm`,`GM`,`Morning`,`GM bro`,`yo`,`sup`,`wsup`]
    let message = [`GM Fam`,`Gm, how are u?`,`morning bro`,`yo, how are u?`,`all good fam`,`good bro, hbu?`]
	
    const seenMessagesIds = new Set();
	
    var loop = true;
    var i = 0;
	
    let welcome = await api.sendMessage(channelId, 'Welcome...'); // If you delete this message, code don't work
    let userId = welcome.message.createdBy // If you delete welcome message, code don't work
	
    while (loop) {
        const messages = await api.getMessages(cid, 100, { after: welcome.message.createdAt });

        const found = messages.messages.filter(msg => msg.content.includes(search[i]) && !seenMessagesIds.has(msg.id) && msg.createdBy != userId );
        
        if (found.length > 0) {
		for (const msg of found) {
                	console.log(`Found message | ID= ${msg.id} | C= "${msg.content}" | A= ${(await api.getUser(serverId, msg.createdBy)).member.user.name}#${(await api.getUser(serverId, msg.createdBy)).member.user.id}`);
                	seenMessagesIds.add(msg.id);
                	const sent = await api.replyToMessage(msg.channelId, msg.id, message[i]);
                	seenMessagesIds.add(sent.message.id);
            	}

        }

	i = (i + 1) % search.length

        await api.delay(5*1000);
    }
}
```

## Send an embed

Update soon...

## Use multiple account tokens

Update soon...

## Use a bot account

This specific script only works for user accounts. If you want to use a bot account, you need to use guilded.js!

## Clear messages of user

Delete the `amount` messages from user (`userId`) sent to a channel/DM (`channelId`) appearing before message and wait `delayMs` milliseconds everytime.

You can use `loop = false` at any time to stop it.

Guilded recently made its rate limiting strictier. I recommend 1100ms or 1500ms as a minimum to not get rate limited. Make it even bigger if you are affraid of getting banned.

```js
{
    id();
    const userId = ""; // Specified User's id
    const channelId = cid;
    const serverId = sid;
    var loop = true;

    let delayMs = 5 * 1000
    let deletionCount = 0

    var amount = 5; // Deletion amount

    while (loop) {
        const messages = await api.getMessages(cid, 100, { before: new Date(Date.now()).toJSON() });
		
		if (messages.messages.length < 100 && messages.messages.filter(x => x.createdBy === userId).length === 0) {
			loop = false
			console.log(` [${deletionCount}/${amount}] Reached the start of the conversation!`)
			continue
		}

        for (const aMessage of messages.messages) {
            if (loop === false) break

            if (deletionCount >= amount) {
                loop = false
                console.log(` [${deletionCount}/${amount}] Deleted the requested amount of messages! `)
                break
            }

            if (aMessage.createdBy === userId) {
                await api.deleteMessage(channelId, aMessage.id)
                deletionCount++
                console.log(` [${deletionCount}/${amount}] Deleted a Message! `)
                if (deletionCount < amount) await delay(delayMs)
            }

        }

        await delay(delayMs)
    }
}
```


# FAQ

## Will I get banned if I do x?

I don't know, maybe u can banned. I have used lots of scripts in the past, not Guilded but Discord, often deleted 100+ messages of mine, accross servers and never got banned, ever.

But I can't guarantee anything. Use at your own risk.

Automating user accounts is againt [Guilded Terms of Use](https://support.guilded.gg/hc/en-us/articles/360039728313-Terms-of-Use).

## Can it do x? Can you help me?

Post your requests in the [Discussions](https://github.com/DeadLyBro/guilded-self-bot-console/discussions) tab. Please search if your request was not mentionned in an earlier post before asking.

## I made a nice/useful script, can I share?

Of course! Post it in the [Discussions](https://github.com/DeadLyBro/guilded-self-bot-console/discussions) tab. Please search if a similar script was shared earlier before posting.

## Why this repo?

I don't think there are many users of Guilded, but I thought I'd do it.

# API

## Full list

Here is the full list of available functions, check [`index.js`](./index.js).

```js
id()
delay(ms)
api.apiCall(apiPath, body, method = 'GET')    // Default apiCall.
api.apiCallv1(apiPath, body, method = 'GET')  // apiCall with no Body. If you get 'Request with GET/HEAD method cannot have body.' & using api ver, use this.
api.apiCal(apiPath, body, method = 'GET')     // apiCall with no Version, this is don't using version.
api.apiCalv1(apiPath, body, method = 'GET')   // apiCal with no Body. If you get 'Request with GET/HEAD method cannot have body.', use this.


// Channels

api.createChannel(name, type, serverId, groupId, categoryId) // type should be; announcements, chat, calendar, forums, media, docs, voice, list, scheduling, or stream.
api.getChannel(channelId)
api.updateChannel(channelId, name, topic, isPublic, body = {})
api.deleteChannel(channelId)

// Servers

api.getServer(serverId)
api.leaveServer(serverId, yourUserId) // This id should be yours.

// Chat & Messaging

api.sendMessage(channelId, message, body = {})
api.getMessages(channelId, limit, params = {})
api.getMessage(channelId, messageId)
api.editMessage(channelId, messageId, newMessage, body = {})
api.deleteMessage(channelId, messageId)
api.replyToMessage(channelId, repliedMessageId, message, body = {})

// Use this generator: https://old.message.style/dashboard
// Click `+` at the bottom in the embed section then copy the `embed` key in the JSON output.
api.sendEmbed(channelId, embed = { title: 'Title', description: 'Description' }) // if you don't want to set author name/url/icon_url just write undefined. e.g: "author": { "name": undefined, "url": undefined, "icon_url": undefined }

api.pinnedMessages(channelId)
    
// getDMs: () => apiCall(`/users/@me/channels`), // Dm channels coming soon


// Members

api.editNick(serverId, userId, nick)
api.deleteNick(serverId, userId)
api.getUser(serverId, userId)
api.kickUser(serverId, userId)
api.getUsers(serverId)

api.setCustomStatus(text, customReactionId, expireInMs)
api.deleteCustomStatus()

api.setGameStatus(id, gameId, type) // Half-Life; id: '3351', gameId: null, type: 'gamepresence'
api.deleteGameStatus()

api.editBio(userId, bio, tagLine, body = {}) // Just English Characters

// Member Bans

api.banUser(serverId, userId, reason) // I haven't tried
api.getBan(serverId, userId)
api.unbanUser(serverId, userId) // I haven't tried
api.getBans(serverId)

// Forums

api.createTopic(forumId, title, message) // You must look a Forum channel or set forum's id.
api.getTopics(forumId)
api.getTopic(forumId, topicId)
api.updateTopic(forumId, topicId, title, message) // If you see differently enter the topic. 
api.deleteTopic(forumId, topicId)
api.pinTopic(forumId, topicId)
api.unPinTopic(forumId, topicId)
api.lockTopic(forumId, topicId)
api.unLockTopic(forumId, topicId)

// List items

api.createList(channelId, title, content)
api.getLists(channelId)
api.getList(channelId, listId)
api.updateList(channelId, listId, title, content)
api.deleteList(channelId, listId)
api.completeList(channelId, listId)
api.unCompleteList(channelId, listId)

// Docs

api.createDoc(channelId, title, content)
api.getDocs(channelId, params = {})
api.getDoc(channelId, docId)
api.updateDoc(channelId, docId, title, content)
api.deleteDoc(channelId, docId)

// Calendar Events (Calendar buggy refresh Guilded App/Tab to see effects)

api.createCalendar(channelId, name, description, location, startsAt, url, rsvpLimit, duration, isOpen)
api.getCalendars(channelId, params = {})
api.getCalendar(channelId, calendarId)
api.updateCalendar(channelId, calendarId, name, description, location, happensAt, happensAtClientTimezone, url, rsvpLimit, durationInMinutes, isOpen) // You can get error just refresh Guilded App/Tab
api.deleteCalendar(channelId, calendarId)
api.getCalendarRSVP(channelId, calendarId, userId)
api.createOrUpdateRSVP(channelId, calendarId, userId, status) // Status can be; "going", "maybe", "declined", "invited", "waitlisted", or "not responded".
api.deleteRSVP(channelId, calendarId, userId)
api.getRSVP(channelId, calendarId)

// Reactions

api.addReaction(channelId, contentId, emoteId)
api.deleteReaction(channelId, contentId, emoteId)

// Server XP

api.addXP(serverId, userId, xpAmount)
api.setXP(serverId, userId, xpTotal)
api.addRoleXP(serverId, roleId, xpAmount)

// Social Links

api.getSocialLinks(serverId, userId, type)

// Group membership

api.addGroup(groupId, userId)
api.removeGroup(groupId, userId)

// Role membership

api.addRole(serverId, userId, roleId)
api.removeRole(serverId, userId, roleId)
api.getUserRoles(serverId, userId)

// Webhooks

api.createWebhook(serverId, channelId, name)
api.getWebhooks(serverId, channelId)
api.getWebhook(serverId, webhookId)
api.updateWebhook(serverId, channelId, webhookId, name)
api.deleteWebhook(serverId, webhookId)

// Emojis

api.getEmojis(serverId, maxEmoji, searchTerm) // If you don't want to specify emoji name, don't write anything to searchTerm. e.g: `await api.getEmojis(serverId, maxEmoji)`
api.addEmoji(serverId, emojiName, link) // Other links don't work... idk, we should use amazonaws image link? e.g: https://s3-us-west-2.amazonaws.com/www.guilded.gg/CustomReaction/image.webp?w=120&h=120
api.deleteEmoji(serverId, emojiId)


```

## `delay(ms)`

`delay(ms: number) => Promise<void>`

Wait for `ms` milliseconds.

```js
await delay(1500)
```

## `id()`

`id() => void`

Update the variable `sid` server id, `gid` guild id and `cid` channel id to what you are currently watching in the Guilded client.

```js
id()
```

## Variables

- `authHeader`: You Guilded account auth token
- `sid`: Current server id (update to what you are currently watching using `id()`)
- `gid`: Current guild id (update to what you are currently watching using `id()`)
- `cid`: Current channel id (update to what you are currently watching using `id()`)

# License

[The MIT License](./LICENSE)
