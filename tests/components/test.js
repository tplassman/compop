module.exports = function({
    id,
    state,
    actions,
    events,
}) {
    console.log('test component received ID: ' + id);
    console.log('test component received state: ' + state);
    console.log('test component received actions: ' + actions.testAction);
    console.log('test component received events: ' + events);
}
