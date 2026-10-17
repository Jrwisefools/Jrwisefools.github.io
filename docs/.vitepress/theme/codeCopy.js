// 代码块复制按钮：在页面渲染完成后给 .VPDoc 下的每个代码块挂一个按钮。
// 用原生 DOM 操作而非组件，是因为正文由 Markdown 编译而来，没法在模板里插入交互元素。

const BTN_CLASS = 'code-copy-btn'

export function setupCodeCopy() {
  if (typeof document === 'undefined') return

  document.querySelectorAll('.VPDoc div[class*="language-"]').forEach((block) => {
    const pre = block.querySelector('pre')
    if (!pre) return
    // 已有复制按钮（自己的或主题自带的）就不再重复挂
    if (block.querySelector(`.${BTN_CLASS}, .copy`)) return

    const btn = document.createElement('button')
    btn.className = BTN_CLASS
    btn.type = 'button'
    btn.textContent = '复制'

    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code')
      const text = code ? code.textContent : pre.textContent
      try {
        await navigator.clipboard.writeText(text || '')
        btn.textContent = '已复制'
        btn.classList.add('copied')
      } catch {
        btn.textContent = '复制失败'
      }
      setTimeout(() => {
        btn.textContent = '复制'
        btn.classList.remove('copied')
      }, 1600)
    })

    block.appendChild(btn)
  })
}
