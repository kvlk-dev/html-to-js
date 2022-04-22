let elarr = [];

function gen(code) {
    let js = ''
    let html = document.createElement('div');
    html.innerHTML = code
    //html = html.childNodes
    html.childNodes.forEach((ep, i) => {
        js += getElem(ep)
    })
    return  js
}

function getElem(ep, tag = null) {
    let js1 = ''
    if (ep.nodeName === '#text' && ep.textContent.trim() !== "") return tag + '.append(\'' + ep.textContent + '\')\n'
    if (ep.nodeName === '#text' || ep.nodeName === '#comment') return ''
    let t = ''
    let tn = t = ep.tagName.toLowerCase()
    if (elarr.includes(tn)) {
        for (let i = 0; i < 999; i++) {
            tn = ep.tagName.toLowerCase() + '_' + i
            if (!elarr.includes(tn)) {
                break;
            }
        }
    }
    elarr.push(tn)
    js1 += 'let ' + tn + ' = document.createElement(\'' + t + '\') \n'
    if (ep.classList.length > 0) {
        let cl = []
        ep.classList.forEach(c => cl.push('\'' + c + '\''))

        js1 += tn + '.classList.add(' + cl.join(',') + ')\n'
    }
    ep.getAttributeNames().forEach(a => {
        if (a !== 'class') {
            if (a.includes('data-')) {
                let spl = a.split('-');
                delete spl[0];
                js1 += tn + '.dataset.' + spl[1]
                delete spl[1]
                if (spl.length > 1) {
                    spl.forEach(n => {
                        js1 += n.charAt(0).toUpperCase() + n.slice(1)
                    })
                }
                js1 += ' = \'' + ep.getAttribute(a) + '\'\n'
            } else if (a.includes('style')) {
                let cssAttr = ep.getAttribute(a)
                let cssRules = []
                if(cssAttr.includes(';')) {
                    cssRules = cssAttr.split(';')
                } else {
                    cssRules.push(cssAttr)
                }
                cssRules.forEach(c => {
                    if(c.includes(':')) {
                        let rule = c.split(':')
                        let ruleName = rule[0]
                        if (ruleName.includes('-')) {
                            let c1 = ruleName.split('-')
                            js1 += tn + '.style.' + c1[0]
                            delete c1[0]
                            c1.forEach(cn => {
                                js1 += cn.charAt(0).toUpperCase() + cn.slice(1)
                            })
                        } else {
                            js1 += tn + '.style.' + ruleName
                        }
                        js1 += ' = \'' + rule[1].trim() + '\'\n'
                    }
                })
            } else {
                js1 += tn + '.' + a + ' = \'' + ep.getAttribute(a) + '\'\n'
            }
        }
    })
    ep.childNodes.forEach((ep) => {
        js1 += getElem(ep, tn)
    })
    if (tag !== null) {
        js1 += tag + '.append(' + tn + ')\n'
    }
    return js1
}