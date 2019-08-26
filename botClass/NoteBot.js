let _note = [];
module.exports = class NoteBot {
  setNote(title, body) {
    let object = {
      title: title,
      body: body
    }

    if (title && body) {
      _note.push(object);
      return `" ${title}  ${body} are saved "`
    } else {
      return `please write title and body in title:".." body:".."`;
    }
  }

  getNote(title) {
    for (let i in _note) {
      if (_note[i].title.indexOf(title) > -1) {
        return `" ${_note[i].title}  ${_note[i].body}  "`
      }
    }
    return `please write title correct`;
  }
  removeNote(title) {
    for (let i in _note) {
      if (_note[i].title.indexOf(title) > -1) {
        _note.splice(i, 1);
        return `delete succsess`;
      }
    }
    return `please write title correct`;
  }
}