var resizeAmt;
var currentURLIndex;
var URLs = new Array("http://images.wsdot.wa.gov/nwflow/flowmaps/syshorz.gif",
                     "http://images.wsdot.wa.gov/nwflow/flowmaps/bridges.gif",
                     "http://images.wsdot.wa.gov/nwflow/flowmaps/north.gif",
                     "http://images.wsdot.wa.gov/nwflow/flowmaps/south.gif");         
                     
var widths = new Array(870, 780, 565, 667);
var heights = new Array(511, 572, 563, 697);

function loaded ()
{
    resizeAmt = 0;
    currentURLIndex = 0;
    
    var resize = widget.preferenceForKey("resizeAmt");
        
    if (resize && resize < 0)
    {
        resizeAmt = resize;
    }
    
    var index = widget.preferenceForKey("currentURLIndex");
        
    if (index && (index > 0))
    {
        currentURLIndex = index;
    }
    
    var now = new Date();
    
    if (window.widget)
    {
        widget.onshow = onshow;
    }

    document.images[0].src = URLs[currentURLIndex] + "?" + now.getTime();
    
    window.resizeBy(widths[currentURLIndex] - window.innerWidth + resizeAmt, heights[currentURLIndex] - window.innerHeight + resizeAmt);
    document.images[0].height = window.innerHeight;
    document.images[0].width = window.innerWidth;
    
    //window.innerWidth = widths[currentURLIndex];
    //window.innerHeight = heights[currentURLIndex];
}

function onshow ()
{
    var now = new Date();
    document.images[0].src = URLs[currentURLIndex] + "?" + now.getTime();
}


function cycle()
{
    var now = new Date();
    currentURLIndex = currentURLIndex + 1;
    
    if (currentURLIndex == URLs.length)
    {
        currentURLIndex = 0;
    }
    
    document.images[0].src = URLs[currentURLIndex] + "?" + now.getTime();
    
    window.resizeBy(widths[currentURLIndex] - window.innerWidth + resizeAmt, heights[currentURLIndex] - window.innerHeight + resizeAmt);
    document.images[0].height = window.innerHeight;
    document.images[0].width = window.innerWidth;
    
        if (window.widget)
        {
            widget.setPreferenceForKey(currentURLIndex, "currentURLIndex");
        }
}

var lastPos;

function mouseResizeDown(event)
{
    var x = event.x + window.screenX;
    var y = event.y + window.screenY;
        
    document.addEventListener("mousemove", mouseResizeMove, true);
    document.addEventListener("mouseup", mouseResizeUp, true);
    lastPos = {x:x, y:y};
    event.stopPropagation();
    event.preventDefault();
}

function mouseResizeMove(event)
{
    var screenX = event.x + window.screenX;
    var screenY = event.y + window.screenY;
    var amt = screenX - lastPos.x;
                        
    if ((amt + document.images[0].height > 200) && (amt + document.images[0].width < (widths[currentURLIndex] - 1)))
    {
        window.resizeBy(amt, amt);
        lastPos = {x:screenX, y:screenY};
        document.images[0].height = window.innerHeight;
        document.images[0].width = window.innerWidth;
    }
    event.stopPropagation();
    event.preventDefault();
}

function mouseResizeUp(event)
{
    resizeAmt = window.innerWidth - widths[currentURLIndex];
    if (window.widget)
    {
      widget.setPreferenceForKey(resizeAmt, "resizeAmt");
    }
    
    document.removeEventListener("mousemove", mouseResizeMove, true);
    document.removeEventListener("mouseup", mouseResizeUp, true); 
    event.stopPropagation();
    event.preventDefault();
}




function showBack()
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");
        
    if (window.widget)
        widget.prepareForTransition("ToBack");
                
    front.style.display="none";
    back.style.display="block";
        
    if (window.widget)
        setTimeout ('widget.performTransition();', 0);  
}

function showFront()
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");
        
    if (window.widget)
        widget.prepareForTransition("ToFront");
                
    back.style.display="none";
    front.style.display="block";
        
    if (window.widget)
        setTimeout ('widget.performTransition();', 0);
}




function enterflip(event)
{
	document.getElementById('fliprollie').style.display = 'block';
}

function exitflip(event)
{
	document.getElementById('fliprollie').style.display = 'none';
}

var flipShown = false;

var animation = {duration:0, starttime:0, to:1.0, now:0.0, from:0.0, firstElement:null, timer:null};

function mousemove (event)
{
    if (!flipShown)
    {
        if (animation.timer != null)
        {
            clearInterval (animation.timer);
            animation.timer  = null;
        }
                
        var starttime = (new Date).getTime() - 13;
                
        animation.duration = 500;
        animation.starttime = starttime;
        animation.firstElement = document.getElementById ('flip');
        animation.timer = setInterval ("animate();", 13);
        animation.from = animation.now;
        animation.to = 1.0;
        animate();
        flipShown = true;
    }
}

function mouseexit (event)
{
    if (flipShown)
    {
        // fade in the info button
        if (animation.timer != null)
        {
            clearInterval (animation.timer);
            animation.timer  = null;
        }
                
        var starttime = (new Date).getTime() - 13;
                
        animation.duration = 500;
        animation.starttime = starttime;
        animation.firstElement = document.getElementById ('flip');
        animation.timer = setInterval ("animate();", 13);
        animation.from = animation.now;
        animation.to = 0.0;
        animate();
        flipShown = false;
    }
}

function animate()
{
    var T;
    var ease;
    var time = (new Date).getTime();
                
        
    T = limit_3(time-animation.starttime, 0, animation.duration);
        
    if (T >= animation.duration)
    {
        clearInterval (animation.timer);
        animation.timer = null;
        animation.now = animation.to;
    }
    else
    {
        ease = 0.5 - (0.5 * Math.cos(Math.PI * T / animation.duration));
        animation.now = computeNextFloat (animation.from, animation.to, ease);
    }
        
    animation.firstElement.style.opacity = animation.now;
}

function limit_3 (a, b, c)
{
    return a < b ? b : (a > c ? c : a);
}

function computeNextFloat (from, to, ease)
{
    return from + (to - from) * ease;
}