// 标签链接的统一入口：所有列表里的标签都指向内容库的「按标签」视图。
// encodeURIComponent 保证 URL 合法；ContentLibrary 会解码 hash 并让 TagsIndex 滚动定位。
export const tagLink = (name) => `/notes/?view=tags#tag-${encodeURIComponent(name)}`
