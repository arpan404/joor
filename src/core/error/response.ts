import Jrror from '@/core/error';
const HeaderSent = new Jrror({
    code: 'response-headers-sent',
    message: 'Headers have already been sent.',
    type: 'error',
    docsPath: '/response',
})

export {
    HeaderSent,
}