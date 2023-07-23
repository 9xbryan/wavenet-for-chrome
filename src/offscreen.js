import { initializeSentry } from "./helpers/sentry-helpers"

// Local variables -------------------------------------------------------------
const audioElement = document.createElement('audio')

// Bootstrap -------------------------------------------------------------------
initializeSentry()

// Event listeners -------------------------------------------------------------
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (!request) return

  const { id, payload, offscreen } = request
  if (!offscreen) return

  if (!handlers[id]) throw new Error(`No handler for ${id}`)
  handlers[id](payload).then(sendResponse)

  return true
})

// Handlers --------------------------------------------------------------------
const handlers = {
  play: function ({ audioUri }) {
    return new Promise((resolve) => {
      audioElement.src = audioUri
      try {
        audioElement.play()
      } catch (e) {
        Sentry.captureException(e)
        resolve(true)
      }

      audioElement.onended = () => {
        resolve(true)
      }
    })
  },
  stop: function () {
    audioElement.pause()
    audioElement.currentTime = 0

    return Promise.resolve(true)
  },
}
