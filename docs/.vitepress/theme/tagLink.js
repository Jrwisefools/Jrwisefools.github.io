// 标签链接的统一入口：所有列表里的标签都指向标签页对应分组。
// encodeURIComponent 保证 URL 合法；标签页的 TagsIndex 会解码 hash 并滚动定位。
export const tagLink = (name) => `/tags#tag-${encodeURIComponent(name)}`
