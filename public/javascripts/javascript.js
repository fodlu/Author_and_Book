FilePond.registerPlugin(
    FilepondPluginImagePreview, 
    FilepondPluginImageResize, 
    FilepondPluginFileEncode, 
)

FilePond.setOptions({
    stylePanelAspectRatio: 150 / 100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150,
})

filePond.parse(document.body);