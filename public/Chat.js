document.addEventListener('keypress', ({ key }) => {
  const message = document.querySelector('#text-msg')
  if (key === 'Enter') {
    if (message.value) {
      const msgs = document.createElement('div')
      msgs.setAttribute('id', 'message')
      msgs.innerHTML = `<b style="color:${document.game.data.hex}">${document.game.data.nick}: </b>${message.value}`
      document.querySelector('.messages').appendChild(msgs)
      message.value = ''
    }
  }
})
