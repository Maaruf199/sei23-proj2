const rootStyles = window.getComputedStyle(document.documentElement)

if (rootStyles.getPropertyValue('--recipe-food-width-large') != null && rootStyles.getPropertyValue('--recipe-food-width-large') !== '') {
  ready()
} else {
  document.getElementById('main-css').addEventListener('load', ready)
}

function ready() {
  const foodWidth = parseFloat(rootStyles.getPropertyValue('--recipe-food-width-large'))
  const foodAspectRatio = parseFloat(rootStyles.getPropertyValue('--recipe-food-aspect-ratio'))
  const foodHeight = foodWidth / foodAspectRatio
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )

  FilePond.setOptions({
    stylePanelAspectRatio: 1 / foodAspectRatio,
    imageResizeTargetWidth: foodWidth,
    imageResizeTargetHeight: foodHeight
  })
  
  FilePond.parse(document.body)
}