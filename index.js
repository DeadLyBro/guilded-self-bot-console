{
	
	authHeader = `Bearer api` // Your Api, change `api` with your `api`. e.g: `Bearer gapi_1234567890ABCDEFGHIJKLMNOPQRSTU`
	
  var delay = ms => new Promise(res => setTimeout(res, ms))
  // prettier-ignore
  var qs = obj => Object.entries(obj).map(([k, v]) => `${k}=${v}`).join('&')

  const xSuperPropertiesObj = {
    os: 'Windows',
    browser: 'Chrome',
    release_channel: 'stable',
    client_version: '1.0.9006',
    os_version: '10.0.22000',
    os_arch: 'x64',
    system_locale: 'en-US',
    client_build_number: 142868,
    client_event_source: null
  }

  const apiCall = (apiPath, body, method = 'GET', options = {}) => {
    if (!authHeader) throw new Error("The authorization token is missing. Did you forget to set it? `authHeader = 'Bearer token'`")
    let fetchOptions = {
      body: body ? body : undefined,
      method,
      headers: {
        Accept: '*/*',
        'Accept-Language': 'en-US',
        Authorization: authHeader,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Guilded/1.0.9153488-release Chrome/94.0.4606.81 Electron/15.3.5 Safari/537.36',
        'X-Super-Properties': btoa(JSON.stringify(xSuperPropertiesObj))
      },
      ...options
    }
    let isFormData = body?.constructor?.name === 'FormData'
    if (!isFormData) {
      fetchOptions.headers['Content-Type'] = 'application/json'
      fetchOptions.body = JSON.stringify(body)
    }
    return fetch(`https://www.guilded.gg/api/v1${apiPath}`, fetchOptions)
      .then(res => res.json().catch(() => {}))
      .catch(console.error)
  } // Default apiCall

  const apiCallv1 = (apiPath, method = 'GET', options = {}) => {
    if (!authHeader) throw new Error("The authorization token is missing. Did you forget to set it? `authHeader = 'Bearer token'`")
    let fetchOptions = {
      method,
      headers: {
        Accept: '*/*',
        'Accept-Language': 'en-US',
        Authorization: authHeader,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Guilded/1.0.9153488-release Chrome/94.0.4606.81 Electron/15.3.5 Safari/537.36',
        'X-Super-Properties': btoa(JSON.stringify(xSuperPropertiesObj))
      },
      ...options
    }
    return fetch(`https://www.guilded.gg/api/v1${apiPath}`, fetchOptions)
      .then(res => res.json().catch(() => {}))
      .catch(console.error)
  } // apiCall with no Body. If you get 'Request with GET/HEAD method cannot have body.' & using api ver, use this; apiCallv1
  
  const apiCal = (apiPath, body, method = 'GET', options = {}) => {
    if (!authHeader) throw new Error("The authorization token is missing. Did you forget to set it? `authHeader = 'Bearer token'`")
    let fetchOptions = {
      body: body ? body : undefined,
      method,
      headers: {
        Accept: '*/*',
        'Accept-Language': 'en-US',
        Authorization: authHeader,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Guilded/1.0.9153488-release Chrome/94.0.4606.81 Electron/15.3.5 Safari/537.36',
        'X-Super-Properties': btoa(JSON.stringify(xSuperPropertiesObj))
      },
      ...options
    }
    let isFormData = body?.constructor?.name === 'FormData'
    if (!isFormData) {
      fetchOptions.headers['Content-Type'] = 'application/json'
      fetchOptions.body = JSON.stringify(body)
    }
    return fetch(`https://www.guilded.gg/api${apiPath}`, fetchOptions)
      .then(res => res.json().catch(() => {}))
      .catch(console.error)
  } // apiCall with no Version ( apiCal )

  const apiCalv1 = (apiPath, method = 'GET', options = {}) => {
    if (!authHeader) throw new Error("The authorization token is missing. Did you forget to set it? `authHeader = 'Bearer token'`")
    let fetchOptions = {
      method,
      headers: {
        Accept: '*/*',
        'Accept-Language': 'en-US',
        Authorization: authHeader,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Guilded/1.0.9153488-release Chrome/94.0.4606.81 Electron/15.3.5 Safari/537.36',
        'X-Super-Properties': btoa(JSON.stringify(xSuperPropertiesObj))
      },
      ...options
    }
    return fetch(`https://www.guilded.gg/api${apiPath}`, fetchOptions)
      .then(res => res.json().catch(() => {}))
      .catch(console.error)
  } // apiCal with no Body. If you get 'Request with GET/HEAD method cannot have body.', use this; apiCalv1


  var api = {
    
    // Channels

    createChannel: (name, type, serverId, groupId, categoryId) => apiCall(`/channels`, { name, type, serverId, groupId, categoryId }, 'POST'), // type should be; announcements, chat, calendar, forums, media, docs, voice, list, scheduling, or stream.
    getChannel: channelId => apiCallv1(`/channels/${channelId}`, 'GET'),
    updateChannel: (channelId, name, topic, isPublic, body = {}) => apiCall(`/channels/${channelId}`, { name: name, topic: topic ?? null, isPublic: isPublic ?? false, ...body} , 'PATCH'),
    deleteChannel: channelId => apiCall(`/channels/${channelId}`, null, 'DELETE'),

    // Servers

    getServer: serverId => apiCall(`/servers/${serverId}`, 'GET'),
    leaveServer: (serverId, yourUserId) => apiCall(`/servers/${serverId}/members/${userId}`, null, 'DELETE'), // This id should be yours.

    // Chat & Messaging

    sendMessage: (channelOrThreadId, message, body = {}) => apiCall(`/channels/${channelOrThreadId}/messages`, { content: message, ...body }, 'POST'),
    getMessages: (channelOrThreadId, limit, params = {}) => apiCall(`/channels/${channelOrThreadId}/messages?limit=${limit ?? 100}&${qs(params)}`),
    getMessage: (channelOrThreadId, messageId) => apiCallv1(`/channels/${channelOrThreadId}/messages/${messageId}`, 'GET'),
    editMessage: (channelOrThreadId, messageId, newMessage, body = {}) => apiCal(`/channels/${channelOrThreadId}/messages/${messageId}`, { content: { object: "value", document: { object: "document", nodes: [ { object: "block", type: "paragraph", nodes: [ { object: "text", leaves: [ { object: "leaf", text: newMessage } ] } ]  } ] }}, ...body }, 'PUT'),
    deleteMessage: (channelOrThreadId, messageId) => apiCall(`/channels/${channelOrThreadId}/messages/${messageId}`, null, 'DELETE'),
    replyToMessage: (channelOrThreadId, repliedMessageId, message, body = {}) =>
      apiCall(`/channels/${channelOrThreadId}/messages`, { content: message, repliesToIds: [repliedMessageId], ...body }, 'POST'),

    // Use this generator: https://old.message.style/dashboard
    // Click `+` at the bottom in the embed section then copy the `embed` key in the JSON output.
    sendEmbed: (channelOrThreadId, embed = { title: 'Title', description: 'Description' }) => apiCall(`/channels/${channelOrThreadId}/messages`, { content: ' ', embeds: [ embed ] }, 'POST'), // if you don't want to set author name/url/icon_url just write undefined. e.g: "author": { "name": undefined, "url": undefined, "icon_url": undefined }

    pinnedMessages: channelId => apiCal(`/channels/${channelId}/pins`),
    
    // getDMs: () => apiCall(`/users/@me/channels`), // Dm channels coming soon


    // Members

    editNick: (serverId, userId, nick) => apiCall(`/servers/${serverId}/members/${userId}/nickname`, { nickname: nick, userId: userId }, 'PUT'),
    deleteNick: (serverId, userId) => apiCall(`/servers/${serverId}/members/${userId}/nickname`, null,'DELETE'),
    getUser: (serverId, userId) => apiCallv1(`/servers/${serverId}/members/${userId}`, 'GET'),
    kickUser: (serverId, userId) => apiCall(`/servers/${serverId}/members/${userId}`, null, 'DELETE'), // I haven't tried
    getUsers: serverId => apiCallv1(`/servers/${serverId}/members`, 'GET'),

    setCustomStatus: (text, customReactionId, expireInMs) => apiCal(`/users/me/status`, { "content":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text": text,"marks":[]}]}]}]}},"customReactionId": customReactionId, "expireInMs": expireInMs }, 'POST'),
    deleteCustomStatus: () => apiCal(`/users/me/status`, null, 'DELETE'),

    setGameStatus: (id, gameId, type) => apiCal(`/users/me/status/transient`, {"id": id, "gameId": gameId,"type": type}, 'POST'), 
    // Half-Life; id: '3351', gameId: null, type: 'gamepresence'
    deleteGameStatus: () => apiCal(`/users/me/status/transient`, null, 'DELETE'),

    editBio: (userId, bio, tagLine, body = {}) => apiCal(`/users/${userId}/profilev2`, { aboutInfo: { bio: bio ?? undefined, tagLine: tagLine ?? undefined }, userId: userId ?? undefined, ...body }, 'PUT'), // Just English Characters

    // Member Bans

    banUser: (serverId, userId, reason) => apiCall(`/servers/${serverId}/bans/${userId}`, { reason: reason }, 'POST'), // I haven't tried
    getBan: (serverId, userId) => apiCallv1(`/servers/${serverId}/bans/${userId}`, 'GET'),
    unbanUser: (serverId, userId) => apiCall(`/servers/${serverId}/bans/${userId}`, null, 'DELETE'), // I haven't tried
    getBans: serverId => apiCall(`/servers/${serverId}/bans`),

    // Forums

    createTopic: (forumId, title, message) => apiCall(`/channels/${forumId}/topics`, { title: title, content: message }, 'POST'), // You must look a Forum channel or set forum's id.
    getTopics: (forumId) => apiCallv1(`/channels/${forumId}/topics`, 'GET'),
    getTopic: (forumId, topicId) => apiCallv1(`/channels/${forumId}/topics/${topicId}`, 'GET'),
    updateTopic: (forumId, topicId, title, message) => apiCall(`/channels/${forumId}/topics/${topicId}`, { title: title, content: message }, 'PATCH'), // If you see differently enter the topic. 
    deleteTopic: (forumId, topicId) => apiCallv1(`/channels/${forumId}/topics/${topicId}`, 'DELETE'),
    pinTopic: (forumId, topicId) => apiCallv1(`/channels/${forumId}/topics/${topicId}/pin`, 'PUT'),
    unPinTopic: (forumId, topicId) => apiCallv1(`/channels/${forumId}/topics/${topicId}/pin`, 'DELETE'),
    lockTopic: (forumId, topicId) => apiCallv1(`/channels/${forumId}/topics/${topicId}/lock`, 'PUT'),
    unLockTopic: (forumId, topicId) => apiCallv1(`/channels/${forumId}/topics/${topicId}/lock`, 'DELETE'),

    // List items

    createList: (channelId, title, content) => apiCall(`/channels/${channelId}/items`, { message: title, note: { content: content } } ,'POST'),
    getLists: (channelId) => apiCallv1(`/channels/${channelId}/items`, 'GET'),
    getList: (channelId, listId) => apiCallv1(`/channels/${channelId}/items/${listId}`, 'GET'),
    updateList: (channelId, listId, title, content) => apiCall(`/channels/${channelId}/items/${listId}`, { message: title, note: { content: content } }, 'PUT'),
    deleteList: (channelId, listId) => apiCallv1(`/channels/${channelId}/items/${listId}`, 'DELETE'),
    completeList: (channelId, listId) => apiCallv1(`/channels/${channelId}/items/${listId}/complete`, 'POST'),
    unCompleteList: (channelId, listId) => apiCallv1(`/channels/${channelId}/items/${listId}/complete`, 'DELETE'),

    // Docs

    createDoc: (channelId, title, content) => apiCall(`/channels/${channelId}/docs`, { title: title, content: content }, 'POST'),
    getDocs: (channelId, params = {}) => apiCallv1(`/channels/${channelId}/docs?${qs(params)}`, 'GET'),
    getDoc: (channelId, docId) => apiCallv1(`/channels/${channelId}/docs/${docId}`, 'GET'),
    updateDoc: (channelId, docId, title, content) => apiCall(`/channels/${channelId}/docs/${docId}`, { title: title, content: content }, 'PUT'),
    deleteDoc: (channelId, docId) => apiCallv1(`/channels/${channelId}/docs/${docId}`, 'DELETE'),

    // Calendar Events (Calendar buggy refresh Guilded App/Tab to see effects)

    createCalendar: (channelId, name, description, location, startsAt, url, rsvpLimit, duration, isOpen) => apiCall(`/channels/${channelId}/events`, { name: name, description: description, location: location ?? undefined, startsAt: startsAt ?? new Date(Date.now()).toJSON(), url: url ?? undefined, color: Math.floor(Math.random() * 16777215) + 1, rsvpLimit: rsvpLimit ?? undefined, duration: duration ?? 1, isOpen: isOpen ?? true }, 'POST'),
    getCalendars: (channelId, params = {}) => apiCallv1(`/channels/${channelId}/events?${qs(params)}`, 'GET'),
    getCalendar: (channelId, calendarId) => apiCallv1(`/channels/${channelId}/events/${calendarId}`, 'GET'),
    updateCalendar: (channelId, calendarId, name, description, location, happensAt, happensAtClientTimezone, url, rsvpLimit, durationInMinutes, isOpen) => apiCall(`/channels/${channelId}/events/${calendarId}`, { name: name, description: description, location: location ?? undefined, happensAt: happensAt ?? new Date(Date.now()).toJSON(), happensAtClientTimezone: happensAtClientTimezone ?? "Europe/Istanbul", url: url ?? undefined, color: Math.floor(Math.random() * 16777215) + 1, rsvpLimit: rsvpLimit ?? undefined, durationInMinutes: durationInMinutes ?? 1, isOpen: isOpen ?? true }, 'PATCH'), // You can get error just refresh Guilded App/Tab
    deleteCalendar: (channelId, calendarId) => apiCallv1(`/channels/${channelId}/events/${calendarId}`, 'DELETE'),
    getCalendarRSVP: (channelId, calendarId, userId) => apiCallv1(`/channels/${channelId}/events/${calendarId}/rsvps/${userId}`, 'GET'),
    createOrUpdateRSVP: (channelId, calendarId, userId, status) => apiCall(`/channels/${channelId}/events/${calendarId}/rsvps/${userId}`, { status: status ?? undefined }, 'PUT'), // Status can be; "going", "maybe", "declined", "invited", "waitlisted", or "not responded".
    deleteRSVP: (channelId, calendarId, userId) => apiCallv1(`/channels/${channelId}/events/${calendarId}/rsvps/${userId}`, 'DELETE'),
    getRSVP: (channelId, calendarId) => apiCallv1(`/channels/${channelId}/events/${calendarId}/rsvps`, 'GET'),

    // Reactions

    addReaction: (channelOrThreadId, contentId, emoteId) => apiCall(`/channels/${channelOrThreadId}/content/${contentId}/emotes/${emoteId}`, null, 'PUT'),
    deleteReaction: (channelOrThreadId, contentId, emoteId) => apiCall(`/channels/${channelOrThreadId}/content/${contentId}/emotes/${emoteId}`, null, 'DELETE'),

    // Server XP

    addXP: (serverId, userId, xpAmount) => apiCall(`/servers/${serverId}/members/${userId}/xp`, { amount: xpAmount }, 'POST'),
    setXP: (serverId, userId, xpTotal) => apiCall(`/servers/${serverId}/members/${userId}/xp`, { total: xpTotal }, 'PUT'),
    addRoleXP: (serverId, roleId, xpAmount) => apiCall(`/servers/${serverId}/roles/${roleId}/xp`, { amount: xpAmount }, 'POST'),

    // Social Links

    getSocialLinks: (serverId, userId, type) => apiCallv1(`/servers/${serverId}/members/${userId}/social-links/${type}`, 'GET'),

    // Group membership

    addGroup: (groupId, userId) => apiCall(`/groups/${groupId}/members/${userId}`, 'PUT'),
    removeGroup: (groupId, userId) => apiCall(`/groups/${groupId}/members/${userId}`, 'DELETE'),

    // Role membership

    addRole: (serverId, userId, roleId) => apiCall(`/servers/${serverId}/members/${userId}/roles/${roleId}`, null, 'PUT'),
    removeRole: (serverId, userId, roleId) => apiCall(`/servers/${serverId}/members/${userId}/roles/${roleId}`, null, 'DELETE'),
    getUserRoles: (serverId, userId) => apiCallv1(`/servers/${serverId}/members/${userId}/roles`, 'GET'),

    // Webhooks

    createWebhook: (serverId, channelId, name) => apiCall(`/servers/${serverId}/webhooks`, { name: name, channelId: channelId }, 'POST'),
    getWebhooks: (serverId, channelId) => apiCallv1(`/servers/${serverId}/webhooks?channelId=${channelId}`, 'GET'),
    getWebhook: (serverId, webhookId) => apiCallv1(`/servers/${serverId}/webhooks/${webhookId}`, 'GET'),
    updateWebhook: (serverId, channelId, webhookId, name) => apiCall(`/servers/${serverId}/webhooks/${webhookId}`, { name: name, channelId: channelId }, 'PUT'),
    deleteWebhook: (serverId, webhookId) => apiCallv1(`/servers/${serverId}/webhooks/${webhookId}`, 'DELETE'),

    // Emojis

    getEmojis: (serverId, maxEmoji, searchTerm) => apiCalv1(`/teams/${serverId}/customReactions?maxItems=${maxEmoji}&searchTerm=${searchTerm ?? ''}`, 'GET'), // If you don't want to specify emoji name, don't write anything to searchTerm. e.g: `await api.getEmojis(serverId, maxEmoji)`
    addEmoji: (serverId, emojiName, link) => apiCal(`/teams/${serverId}/customReactions`, {"name": emojiName ,"png": link,"webp": link,"apng": link} , 'POST'), // Other links don't work... idk, we should use amazonaws image link? e.g: https://s3-us-west-2.amazonaws.com/www.guilded.gg/CustomReaction/image.webp?w=120&h=120
    deleteEmoji: (serverId, emojiId) => apiCalv1(`/teams/${serverId}/customReactions/${emojiId}`, 'DELETE'),

    delay,
    apiCall
  }

  console.log('\n\n\n\n\n\n\nSelfbot loaded! Use it like this: `await api.someFunction()`')
  console.log('Abusing this could get you banned from Guilded, use at your own risk!')
  console.log()
  console.log(
    'This script does **not** work with bot accounts! ' +
      'If you have a bot account, use a proper lib like guilded.js!'
  )
  console.log()
  console.log('Use the `id()` function to update the variable `sid` server id, `gid` group id and `cid` channel id to what you are currently watching. \n Note: If you\'re getting error try to look a server and try again.')
  console.log('https://github.com/DeadLyBro/guilded-self-bot-console')

  var sid = '' // Current server id
  var gid = '' // Current group id
  var cid = '' // Current channel id

  // Call this to update `sid`, `cid` and `gid` to current server, group and channel id
  var id = (log = true) => {
    if (document.querySelector('.TeamSelectorItem-container span div.NavSelectorItem-container-active div div.NavSelectorItem-contents') != undefined) {
      sid = document.querySelector('.TeamSelectorItem-container span div.NavSelectorItem-container-active div div.NavSelectorItem-contents').getAttribute('data-team-id')
    }else {
      console.log(`%cCould not retrieve Server id!!! Please look a channel and write \`id()\` again to get Server id!`, 'color: red; font-size: 16pt')
    }
    
    gid = window.location.href.split('/').slice(5)[0]
    cid = window.location.href.split('/').slice(6)[1]

    if (log) {
      console.log(`\`sid\` was set to the server id you are currently looking at (${sid})`)
      console.log(`\`gid\` was set to the group id you are currently looking at (${gid})`)
      console.log(`\`cid\` was set to the channel id you are currently looking at (${cid})`)
    }
  }
  id(false)

}