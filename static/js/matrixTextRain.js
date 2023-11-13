var tileSize = 20;
var fadeFactor = 0.05;

var canvas;
var ctx;

var columns = [];
var maxStackHeight;

function initMatrix()
{
    errorModalBody = document.getElementById(`ErrorModal`)
    canvas = document.createElement( 'canvas' );
    canvas.width = document.getElementById('ErrorModal').offsetWidth;
    canvas.height = document.getElementById('ErrorModal').offsetHeight;
    document.body.appendChild(canvas);
    ctx = canvas.getContext( '2d' );

    maxStackHeight = Math.ceil(canvas.height/tileSize);

    for ( let i = 0 ; i < canvas.width/tileSize ; ++i )
    {
        var column = {};
        column.x = i*tileSize;
        column.stackHeight = 10+Math.random()*maxStackHeight;
        column.stackCounter = 0;
        columns.push( column );
    }

    addEventListener('resize', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        canvas.width = document.getElementById('ErrorModal').offsetWidth;
        canvas.height = document.getElementById('ErrorModal').offsetHeight;

        maxStackHeight = Math.ceil(canvas.height/tileSize);

        for ( let i = 0 ; i < canvas.width/tileSize ; ++i )
        {
            var column = {};
            column.x = i*tileSize;
            column.stackHeight = 10+Math.random()*maxStackHeight;
            column.stackCounter = 0;
            columns.push( column );
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    tick();
}

function draw()
{
    ctx.fillStyle = "rgba( 0 , 0 , 0 , "+fadeFactor+" )";
    ctx.fillRect( 0 , 0 , canvas.width , canvas.height );

    ctx.font = (tileSize-2)+"px monospace";
    ctx.fillStyle = "rgb( 0 , 255 , 0 )";
    for ( let i = 0 ; i < columns.length ; ++i )
    {
        var randomCharacter = String.fromCharCode( 33+Math.floor(Math.random()*94) );
        ctx.fillText( randomCharacter , columns[i].x , columns[i].stackCounter*tileSize+tileSize );

        if ( ++columns[i].stackCounter >= columns[i].stackHeight )
        {
            columns[i].stackHeight = 10+Math.random()*maxStackHeight;
            columns[i].stackCounter = 0;
        }
    }
}

function tick() 
{    
    draw();
    setTimeout( tick , 50 );
}
