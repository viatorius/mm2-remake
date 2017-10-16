class StatusData{}

StatusData.DATA = [
    ['poisoned'],
    ['asleep'],
    ['paralysed'],
    ['silenced'],
    ['weak'],
    ['raging'],
    ['blessed'],
    ['heroism']
];

StatusData.getStatusIndex = function(x) {
    for(var i=0;i<StatusData.DATA.length; i++) {
        if(StatusData.DATA[i][0] == x) return i;
    }
    return -1;
}