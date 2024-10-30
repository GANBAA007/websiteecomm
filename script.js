// window.addEventListener('load', () => {
//     createSlideOver()
// })

const slide_over = document.getElementById('slide_over')
function openSlideover() {
    slide_over.classList.add('open_slide_over')
}

function closeSlideover() {
    slide_over.classList.add('closing_slide_over')

    setTimeout(() => {
        slide_over.classList.remove('open_slide_over')
        slide_over.classList.remove('closing_slide_over')
    }, 500)
}

// function createEl(el, className, id) {
//     const elem = document.createElement(el)
//     if (id) {
//         elem.setAttribute('id', id)
//     }
//     if (className) {
//         elem.classList.add(className)
//     }

//     return elem
// }

// function createSlideOver() {
//     const slide_over_overlay = createEl('div', 'overlay', null)
//     const slide_over_content = createEl('div', 'content', null)
//     const slide_over_content_header = createEl('div', 'header', null)
//     const slide_over_content_body = createEl('div', 'body', null)
//     const slide_over_content_header_title = createEl('p', null, null)

//     slide_over_content_header.appendChild(slide_over_content_header_title).innerHTML = 'Cart'

//     slide_over_content.appendChild(slide_over_content_header)
//     slide_over_content.appendChild(slide_over_content_body)

//     slide_over.appendChild(slide_over_overlay)
//     slide_over.appendChild(slide_over_content)
// }