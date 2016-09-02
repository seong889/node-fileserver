function join(/* path segments */) {
    // Split the inputs into a list of path commands.
    var parts = [];
    for (var i = 0, l = arguments.length; i < l; i++) {
        parts = parts.concat(arguments[i].split("/"));
    }
    // Interpret the path commands to get the new resolved path.
    var newParts = [];
    for (i = 0, l = parts.length; i < l; i++) {
        var part = parts[i];
        // Remove leading and trailing slashes
        // Also remove "." segments
        if (!part || part === ".") continue;
        // Interpret ".." to pop the last segment
        if (part === "..") newParts.pop();
    // Push new path segments.
        else newParts.push(part);
    }
    // Preserve the initial slash if there was one.
    if (parts[0] === "") newParts.unshift("");
    // Turn back into a single string path.
    return newParts.join("/") || (newParts.length ? "/" : ".");
}



function href(type, path) {
    location.href = location.origin + join(`/${type}`, path)
}
function dir_click(path) {
    href('dirs', path)
}
file_click = text_click = application_click = function (path) {
    href('down', path)
}


function video_click(path, name) {
    modal_open(path, name, 'video')
}
function audio_click(path, name) {
    modal_open(path, name, 'audio')
}
function image_click(path, name) {
    modal_open(path, name, 'img')
}

function modal_open(path, name, tag) {
    $('.modal-title').text(name)
    $('.modal-body').html(`<${tag} src="${join('/down', path)}" controls preload="metadata" style="width:100%"> </${tag}>`)
    $('#modal-down').attr( 'href', join('/down', path))
    $('#modal').modal({
    backdrop: "static",
    show: true,
    keyboard: false,
    })
}

$('#modal').on('hidden.bs.modal', function (e) {
    $('.modal-body').html('')
})