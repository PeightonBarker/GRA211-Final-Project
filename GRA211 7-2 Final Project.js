(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.currentSoundStreamInMovieclip;
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos != null) { this.startStreamSoundsForTargetedFrame(pos); }
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		this.soundStreamDuration.forEach(function(value,key){
			key.instance.stop();
		});
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var _this = this;
			this.soundStreamDuration.forEach(function(value,key,arr){
				if((value.end) == currentFrame){
					key.instance.stop();
					if(_this.currentSoundStreamInMovieclip == key) { _this.currentSoundStreamInMovieclip = undefined; }
					arr.delete(key);
				}
			});
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			var _this = this;
			if(this.soundStreamDuration.size > 0){
				var maxDuration = 0;
				this.soundStreamDuration.forEach(function(value,key){
					if(value.end > maxDuration){
						maxDuration = value.end;
						_this.currentSoundStreamInMovieclip = key;
					}
				});
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if((deltaFrame >= 0) && this.ignorePause){
					cjs.MovieClip.prototype.play.call(this);
					this.ignorePause = false;
				}
				else if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
				else if(deltaFrame <= -2){
					cjs.MovieClip.prototype.stop.call(this);
					this.ignorePause = true;
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.Tween4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("ADNBSQgRAAgggEQgLgBgFgDQgFgEgFgMIgMgiIgBAAIgGAAQgHAAgFABIgFABQgFAOgGAMQgIAPgIAFQgHAFgSABIguADQgWAAgOgCQgSgBgJgHQgNgHgFgTIgEgQIgBgHIgLADIgPAAIgGAAIgMAfQgGALgHAEQgFAFgPABQgTACgTAAQgSAAgdgCIgNgBQgHgCgFgDQgFgFgFgLIgXg2QgJgUgDgLQgCgKAAgVQAAgHACgEIABgCIABgCQADgEAHAAIAkAAQBtgCArAAIBvADQBCABAsgCIABAAIACgBIAFABIAcgBIAhgBIByABIACAAIAfAAIABAAIADABIACACIADACIAAABIABAEIAAAAIAAACIgBADQAAADgDAFIAAADIgBAGIgBAJIAAABIgBAFIgDAKIAAgBIgBADIgNA0IgEARIgCADQgGAQgKAHQgIAGgSACIgfACIgRgBgAB2g/QAEAMACARIAGAlQAEARANAgQACAFACABQADACADAAQAgAEASAAQAcABAVgDQAIgCAGgDQAGgEAEgOQAGgSAJgrIAIgiIAAgCIABgFIgWAAIgDAAIhnAAIgrAAgAhbg5QAMArAIAoQACANADAGQAEAKAJADQAEACAJABQApAEArgFQAJgBAEgDQAFgDAEgJQAWgrAJg5IACgEIgCgCIgBAAQg4AChugCIgXgBIACAGgAkyg6QgBAPAFAQQADALAIASIAUAsQADAHAEADQADACAJABQAoAEAogDQAKgBAFgDQAEgDAEgJIAMgfIAOgjQAHgUADgRIABgEQhSgBgtABIghABIghAAIgBAAIAAAEgAhzAHIAKAAIAIgBIADABIgGgcIgCgHIgNAjgABmAAIgBAGIALAAIAAgDIgDgXQgDAMgEAIg");
	this.shape.setTransform(0,0.0117);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#C0B7AE").s().p("ADLBAQgRAAgggEQgEAAgCgCQgDgBgBgFQgNgggEgRIgHglQgCgRgEgMIAQAAIAqAAIBnAAIADAAIAWAAIAAAFIgBACIgIAiQgJArgGASQgEAOgGAEQgFADgIACQgRADgVAAIgMgBgAgsA9QgJgBgEgCQgIgDgFgKQgCgGgDgNQgIgogLgrIgDgGIAXABQBvACA4gCIABAAIABACIgBAEQgKA5gVArQgFAJgEADQgFADgJABQgYADgXAAQgTAAgSgCgAkAA7QgJgBgDgCQgDgDgDgHIgVgsQgIgSgDgLQgFgQABgPIAAgEIABAAIAiAAIAggBQAtgBBTABIgCAEQgDARgHAUIgNAjIgNAfQgEAJgEADQgEADgKABQgTABgTAAQgWAAgVgCgAh3AHIANgjIACAHIAHAcIgEgBIgIABgABhAGIACgGQADgIADgMIADAXIABADIgMAAgAE3gZIAAABIgBACg");
	this.shape_1.setTransform(0.3917,0.0161);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-32.5,-8.2,65,16.5);


(lib.Tween3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#C0B7AE").s().p("ADLBAQgRAAgggEQgEAAgCgCQgDgBgBgFQgNgggEgRIgHglQgCgRgEgMIAQAAIAqAAIBnAAIADAAIAWAAIAAAFIgBACIgIAiQgJArgGASQgEAOgGAEQgFADgIACQgRADgVAAIgMgBgAgsA9QgJgBgEgCQgIgDgFgKQgCgGgDgNQgIgogLgrIgDgGIAXABQBvACA4gCIABAAIABACIgBAEQgKA5gVArQgFAJgEADQgFADgJABQgYADgXAAQgTAAgSgCgAkAA7QgJgBgDgCQgDgDgDgHIgVgsQgIgSgDgLQgFgQABgPIAAgEIABAAIAiAAIAggBQAtgBBTABIgCAEQgDARgHAUIgNAjIgNAfQgEAJgEADQgEADgKABQgTABgTAAQgWAAgVgCgAh3AHIANgjIACAHIAHAcIgEgBIgIABgABhAGIACgGQADgIADgMIADAXIABADIgMAAgAE3gZIAAABIgBACg");
	this.shape.setTransform(0.3917,0.0161);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("ADNBSQgQAAghgEQgLgBgFgDQgGgEgEgMIgMgiIgBAAIgGAAQgHAAgFABIgFABQgFAOgGAMQgIAPgIAFQgIAFgQABIgwADQgVAAgPgCQgRgBgKgHQgMgHgGgTIgDgQIgBgHIgKADIgQAAIgGAAIgMAfQgGALgHAEQgGAFgPABQgSACgTAAQgTAAgcgCIgNgBQgHgCgFgDQgFgFgFgLIgYg2QgIgUgDgLQgCgKAAgVQAAgHACgEIAAgCIACgCQADgEAHAAIAkAAQBtgCArAAIBvADQBCABAsgCIABAAIACgBIAFABIAcgBIAhgBIBxABIADAAIAfAAIABAAIADABIADACIACACIAAABIABAEIAAAAIAAACIgBADQAAADgCAFIAAADIgCAGIgBAJIgBABIgBAFIgCAKIAAgBIgBADIgNA0IgEARIgCADQgGAQgKAHQgIAGgSACIgfACIgRgBgAB2g/QADAMADARIAGAlQAFARAMAgQACAFADABQACACADAAQAhAEARAAQAcABAVgDQAIgCAGgDQAFgEAFgOQAGgSAJgrIAIgiIABgCIAAgFIgXAAIgCAAIhnAAIgqAAgAhag5QALArAIAoQADANACAGQAFAKAIADQAEACAIABQApAEAsgFQAJgBAEgDQAFgDAEgJQAWgrAKg5IABgEIgBgCIgBAAQg5AChugCIgXgBIADAGgAkyg6QgBAPAFAQQADALAIASIAVAsQADAHADADQADACAJABQAoAEApgDQAJgBAFgDQAEgDAEgJIANgfIANgjQAGgUAEgRIABgEQhSgBguABIgfABIgiAAIgBAAIAAAEgAhzAHIAJAAIAJgBIADABIgGgcIgCgHIgNAjgABmAAIgBAGIALAAIAAgDIgDgXQgDAMgEAIg");
	this.shape_1.setTransform(0,0.0117);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-32.5,-8.2,65,16.5);


(lib.timerfinger_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#CC0000").s().p("AFUBxQgGgGACgJIABgDQgCgFABgIQgDgFAAgKIAAguQmQADjLgCIg/gCIgggCIgFAGQgKALgOAGQgNAFgPgBQgPgBgNgHQgcgQgFgeQgCgRAHgQQAGgRAOgKQAVgRAbADQAbAEAQAVQAGAHADAHQAtAFA2ACQArABBWAAIHPgCIAAgnIABgHIgBgDQgBgJACgGQACgGAGgFIACgBIAFgCQAGAAAFADQAEADACAEIABACQAIAIANAIIBTA4QANAKAAAJQAAAGgFAEIgEADIgBACQgBAEgIAIIgYAZQgQASgJAIIgZAUQgPANgJAIQgIAIgEACIgFABQgFAAgFgEg");
	this.shape.setTransform(197.1015,54.71);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(148.7,43.1,96.80000000000001,23.300000000000004);


(lib.time_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFF0").s().p("AgIJhQhcgGg9gMQhTgRg9giQhsg+hViPQg6hlgihwIgFgPQgPhLAThZQANg/AphuQAUg5ARgcQAQgbAfggIA0g1IAhgkQATgUARgMIARgMQAHgGAFgGIAFgDQBPgvBZgXQAfgIAfgEIAEADQAHAFAIAAQAFAAAKgDQALgEAXgDIAhgEIASABQBbAFBXAgQBPAdBDAwQACAGAJAJQAUAVAjAeQAKAIAIAFIAFADQANAQALARQAQAaAeBGQAJAWALALQAWA2AKA1QAIAmAGBQQAFBFgDAiQgEAogSA8QgYBTgZA1QghBHguAuQgcAbgXALIgVAKQgMAHgGAHQgGAHgCAKIgVASQgdAYgWAMQg6AjhSAJQghAEgsAAQgiAAgngCgAgFFzQgCAEAAAMIAAAVQAAANABAIIABAPIABAwQAAAKABAEQADAMAOABQANAAAGgLQACgGAAgLIgDhrQAAgJgDgFQgFgMgNAAQgLAAgFANgAjSFuQgIACgMAMIgXAYQgMANgCAHQgHANAIALQAEAFAHACQAHACAGgEQAGgDAJgNQAJgNALgKIANgMQAGgIABgIQAAgIgHgHQgHgFgGAAIgDAAgADhFtQgJAEgCAHQgDAJAEALQADAOAEALQAFAMAFAHQAHAKALABQAIAAAGgGQAGgGAAgIQAAgFgDgHIgGgMIgHgXQgFgPgJgEQgEgCgEAAQgDAAgEACgAF2DRQgEAFAAAGQAAAHADAEQADAEAJAGIAVAOQANALAIAEQAPAGAKgHQAFgDACgGQADgGgCgGQgDgIgJgGIgRgKIgRgOQgKgIgIgBIgFgBQgKAAgHAJgAl6DVIgaAMIgMAFQgIADgEADQgIAIACAMQADAMALADQAJACAQgHIAhgOQAKgEAFgFQAFgGgBgJQgBgJgHgFQgGgEgHAAQgHAAgHADgAgWg/QgRAIgLAPQgLAPgDATQgCATAHARQAHARAOANQAPANASADQARAEATgFQASgGANgNQATgSADgZQADgYgNgWQgJgQgRgKQgQgKgTgBIgEAAQgPAAgQAHgAnfgKQgSABgHAHQgGAGABAKQABAJAJAFQAHAEARgCQAdgEAXAAIAuAAQAQAAAHgFQAKgGgCgMQgCgLgLgEQgEgBgKAAgAH6AYQAIAAAGgDQAKgGAAgMQAAgLgKgFQgEgCgJgBQgSgDgcAAIgOAAIgRgDQgMgCgNABIgMABIgOgBQgHABgEAGQgFAFgBAHQAAAFADAGQAEAGAGADQAFADAJAAIAYgDQAIAAAPAEQANACAbgBIAeADgAGjkEQgNAOgHAGQgKAGgEAFQgJALAFALQADAGAFADQAFAEAGgBQAFAAAKgGQAKgGAGgFIANgPIAGgGQAEgEACgDQAGgJgEgJQgEgKgKgCIgEgBQgLAAgKALgAm0kRQgIADgCAKQgCAKAFAHQAEAFAKAGQARAKASAIQAKAFAGAAQAJAAAFgHQAGgHgBgIQgBgLgNgJIgYgLIgSgKQgHgDgFAAQgFAAgEACgAAJoEQgNABgEAMQgBAEAAAKIAABsQAAAJABAEQAFAMAMABQAFABAGgEQAFgDACgFQADgFAAgMIAAhoQAAgNgDgFQgFgLgLAAIgCAAgAD9nGQgFAEgIALQgSAagGAOQgEAMAAAHQABAMAIAFQAGAEAHgBQAHgBAFgFQAEgEADgIIAFgPIAPgVQAJgMABgKQABgHgDgGQgCgGgGgCQgEgCgEAAQgGAAgGAFgAkAnHQgIAEgCAIQgCAIAHAUQAJAZADAEQAKAQAPgDQAJgBAFgIQAEgIgCgJIgIgOIgFgMIgEgNQgGgPgKgEIgGgBQgFAAgEADg");
	this.shape.setTransform(260.7435,141.8835);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFCC33").s().p("AGdM9IgXgPIgXgRIgggUQgbgRgYgMIgjgUIgCgBQAjgMAegSQAXgNAfgZIAzgnIAEAhIAACEIABAyIgJgGgAneMiIAKgsIAJg8IALhnQAXAWAaATQA5AqBDAZQgZASgpAWQg5AggZASIgZARIgjATIgBABIAGgcgAnrmWIgZgVIAFgGIAGgIIALgKIAHgJIAGgFIABABIAJALQAGAGADAFIAFALIgdAfIgFgGgAHpm5IgJgKIAMgJIAJgKIADADIASATIAJALIgNAMIgHAIIgWgYgApOm0QgQgWgKgIIgSgNQgKgIgCgJQgBgIAGgJIAMgOIAQgWQAJgNAIgHQAJgJAOgIQAEgDAFgBQAGgBAHAEQARAJARAQQAJAJATAXIADAFIgEAFQgNALgDAGIgDAIIgDACIgNAOQgEAGgQAQIgKALIgCAFIgBABIgDACIgBABIgHAFQgDADgEABIAAAAQgHAAgHgIgAI+nFIgWgXQgdgfgVgSIAAgBIAKgMIAWgPQANgJALgMQAHgHAEAAQAEgBAGAGIAXAVIATANQAUAPAFAZQABAFgBADQgBADgEADIguArIgGAFIgPgNgAgCqHQgCgQABgJIAAgFIAQABIAAABIABAWIgEAUIgKABIgCgPgAgbrPIgIAAIAAgLQgBgOACgeQACgdgBgPQgBgHADgCQACgCAEAAQAfgFAhAAQADAHgBAXIACAiQACAWgBALIAAAUIAAACg");
	this.shape_1.setTransform(261.0673,135.9602);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("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");
	this.shape_2.setTransform(261.2885,137.6578);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(192.4,48.4,137.79999999999998,178.5);


(lib.surpriseparty_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#B53366").s().p("AhIDzIAAjUIh+kRICUAAIAyBuIAzhuICUAAIh+ERIAADUg");
	this.shape.setTransform(569.65,89.825);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#B53366").s().p("AhIDzIAAkgIhKAAIAAjFIElAAIAADFIhKAAIAAEgg");
	this.shape_1.setTransform(534.025,89.825);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#B53366").s().p("AAdDzIAAgEQAAhWgQgtQgPgtgeAAIgCAAIAAC0IiSAAIAAnlICSAAQBLAAAaAFQAaAFATASQATASAMAfQALAfAAAjQAABJglAkQA2BaAKCPgAgigwIAEAAQAVAAAJgMQAJgLAAgZQAAgugoAAIgDAAg");
	this.shape_2.setTransform(501.125,89.825);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#B53366").s().p("ABJDzIgThTIhqAAIgSBTIiVAAIB3nlIDQAAIBvHlgAgZAuIA1AAIgbh2g");
	this.shape_3.setTransform(457.95,89.825);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#B53366").s().p("AilDzIAAnlICNAAQBOAAAiALQAgALAXApQAXAogBA7QABBIggAuQggAvgxAAQghAAgmgqIAADIgAgSgfIACAAIAIABQARAAAKgPQALgOAAgbQAAgdgKgLQgKgLgaAAIgCAAg");
	this.shape_4.setTransform(422.85,89.825);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#B53366").s().p("AiIDzIAAnlIERAAIAAB6IiAAAIAAA8IBaAAIAAB5IhaAAIAAA8ICAAAIAAB6g");
	this.shape_5.setTransform(366.475,89.825);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#B53366").s().p("AiaDXIAkijQAPAkAYAUQAXAWAVAAQAKAAAIgHQAGgJAAgLQAAgMgFgIQgFgJgKgGIgkgXQgngXgQgeQgSggAAgtQAAilCeAAQBHAAA9AhIglCZQgQgigWgTQgWgTgWAAQgLAAgHAHQgIAGAAAMQAAAPAKAIQAJAKAiATQAjAUAUASQATARAMAbQALAaAAAmQAACkieAAQhSAAhFgkg");
	this.shape_6.setTransform(333.1,89.8);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#B53366").s().p("AhIDzIAAnlICRAAIAAHlg");
	this.shape_7.setTransform(306.375,89.825);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#B53366").s().p("AAdDzIAAgEQAAhWgQgtQgPgtgeAAIgCAAIAAC0IiSAAIAAnlICSAAQBLAAAaAFQAaAFATASQATASAMAfQALAfAAAjQAABJglAkQA2BaAKCPgAgigwIAEAAQAVAAAJgMQAJgLAAgZQAAgugoAAIgDAAg");
	this.shape_8.setTransform(277.325,89.825);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#B53366").s().p("AikDzIAAnlICNAAQBNAAAiALQAgALAXApQAWAoABA7QAABIggAuQghAvgwAAQghAAgmgqIAADIgAgSgfIABAAIAIABQASAAAKgPQALgOAAgbQAAgdgKgLQgKgLgaAAIgCAAg");
	this.shape_9.setTransform(238.75,89.825);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#B53366").s().p("AAdDzIAAgEQAAhWgQgtQgPgtgeAAIgCAAIAAC0IiSAAIAAnlICSAAQBLAAAaAFQAaAFATASQATASAMAfQALAfAAAjQAABJglAkQA2BaAKCPgAgigwIAEAAQAVAAAJgMQAJgLAAgZQAAgugoAAIgDAAg");
	this.shape_10.setTransform(200.525,89.825);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#B53366").s().p("AhIDfQgkgYgVgnQgUgngIgvQgGgugBhbIAAi3ICTAAIAADhQgBAdAEANQAEANAKAAQAKAAAEgOQAEgPAAguIAAjNICSAAIAAC1QAABOgDAjQgDAkgNAmQgNAngWAcQgXAbgcAPQgdAQgdAAQglAAgkgYg");
	this.shape_11.setTransform(159.95,90.2);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#B53366").s().p("AiaDXIAkijQAQAkAWAUQAYAWAUAAQAMAAAGgHQAHgJAAgLQAAgMgFgIQgFgJgKgGIgkgXQgmgXgSgeQgRggAAgtQAAilCdAAQBIAAA9AhIgkCZQgRgigWgTQgWgTgWAAQgMAAgGAHQgIAGABAMQAAAPAJAIQAJAKAiATQAkAUATASQAUARAKAbQAMAaAAAmQAACkieAAQhSAAhFgkg");
	this.shape_12.setTransform(124.35,89.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(103.1,44.3,492,91.39999999999999);


(lib.sugar3_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// cups
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AgXAjIAAhFIAVAAQAKAAAFABQAEACAEAGQADAGAAAJQAAAKgFAGQgEAGgIAAQgEAAgFgGIAAAdgAgCgDIAAAAIABAAQABAAAAgBQABAAAAAAQABAAAAgBQABAAAAgBQABgCABgDQgBgFgBgCQgCgBgDAAIAAAAg");
	this.shape.setTransform(254.5,60.35);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AgKAgQgFgDgDgGQgDgGgBgGIgBgTIAAgaIAVAAIAAAgIABAFQAAAAAAABQAAAAAAABQABAAAAAAQAAAAAAAAQAAAAAAAAQABAAAAAAQAAgBAAAAQABgBAAAAIAAgIIAAgdIAWAAIAAAaIgBAPIgCALQgCAFgDAEIgIAGQgEACgEABQgFAAgFgEg");
	this.shape_1.setTransform(248.625,60.4);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AgPAaQgHgKAAgQQAAgPAIgKQAHgKALAAQAFAAAFACQAFACAEAEIgJAYQgEgCgFAAQgFAAAAAFQAAAAAAABQAAAAAAABQAAAAAAABQAAAAAAAAQACACADAAQAFAAAEgDIAJAbQgDACgFADQgGACgGAAQgKAAgIgKg");
	this.shape_2.setTransform(243.175,60.35);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#000000").s().p("AgKAjIAAg8IAUgJIAABFg");
	this.shape_3.setTransform(234.15,60.3);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#000000").s().p("AgXAjIAAhFIAUAAQALAAAFACQAFABADAGQADAGAAAIQAAAKgFAHQgEAGgIAAQgEAAgFgGIAAAdgAgCgDIAAAAIABAAQABAAAAgBQABAAAAAAQABAAAAgBQABAAAAAAQABgDAAgDQAAgEgBgDQgBgBgEAAIAAAAg");
	this.shape_4.setTransform(252.45,101.95);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#000000").s().p("AgKAgQgFgDgDgGQgDgGgBgHIgBgSIAAgaIAVAAIAAAgIABAFQAAABAAAAQAAAAAAABQABAAAAAAQAAAAAAAAQAAAAAAAAQABAAAAAAQAAgBAAAAQABAAAAgBIAAgIIAAgdIAWAAIAAAaIgBAPIgCALQgCAFgDAEIgIAHQgEACgEAAQgFgBgFgDg");
	this.shape_5.setTransform(246.575,102);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#000000").s().p("AgPAaQgHgKAAgQQAAgOAIgLQAHgKALAAQAFAAAFACQAFACAEADIgJAZQgEgCgFAAQgFAAAAAFQAAAAAAABQAAAAAAABQAAAAAAABQAAAAAAABQACABADAAQAFAAAEgCIAJAaQgDACgFADQgGACgGAAQgKAAgIgKg");
	this.shape_6.setTransform(241.125,101.95);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#000000").s().p("AgKAkIAAg9IAVgJIAABGg");
	this.shape_7.setTransform(232.1,101.9);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#000000").s().p("AgXAjIAAhFIAUAAQALAAAFACQAFABADAGQADAGAAAIQAAALgFAFQgEAHgIAAQgEAAgFgGIAAAdgAgCgEIAAAAIABAAQABAAAAAAQABAAAAAAQABAAAAgBQABAAAAAAQABgCAAgFQAAgDgBgCQgBgCgEAAIAAAAg");
	this.shape_8.setTransform(252.45,142.75);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#000000").s().p("AgKAgQgFgDgDgGQgDgFgBgIIgBgTIAAgaIAVAAIAAAhIABAFQAAAAAAABQAAAAAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQABAAAAgBQAAAAAAAAQABgBAAAAIAAgIIAAgeIAWAAIAAAaIgBAQIgCAKQgCAGgDAEIgIAHQgEABgEAAQgFAAgFgDg");
	this.shape_9.setTransform(246.575,142.8);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#000000").s().p("AgPAaQgHgKAAgPQAAgQAIgKQAHgKALAAQAFAAAFACQAFACAEADIgJAZQgEgCgFAAQgFAAAAAFQAAAAAAABQAAAAAAABQAAAAAAABQAAAAAAAAQACACADAAQAFAAAEgCIAJAaQgDADgFACQgGACgGAAQgKAAgIgKg");
	this.shape_10.setTransform(241.125,142.75);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#000000").s().p("AgKAkIAAg+IAVgJIAABHg");
	this.shape_11.setTransform(232.1,142.7);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#B3B5B6").s().p("Aj3IpIgZgBIgtgFQgggEgOgFQgOgFgJgFIgOgLQgLgKgEgGQgJgNgEgVQgEgSgCgtIgBg7IgCg9QAJAGALADQALADASACIBFAKIAwAGIAzADIAvADQAaAAA0gCIAkgCQAagCArgJQAWgDALgEQAOgEAJgGIgCA3IgCAVIgMBZIgGAdQgEAPgJAKQgFAGgKAHQgeAUgsAHQgeAFgyABIgxAAIg8AAgABVEpIgCAAIABgMIAAgPIADAAIDWAAIAzABQAcACAWAFQAMACADAGQgEAHgQABQhNAFiaAAQg2AAgbgCgAFhEVIgDABIAAAGIABADIACACQACADAEABIAKABIANgBQAIgBAEgBQAEgBACgCQAAAAAAgBQABAAAAAAQAAgBAAAAQABgBAAAAQAAgBAAAAQAAgBgBAAQAAgBAAAAQAAgBgBAAIgGgEIgJgCIgaAAQgDAAgDACgAj3CRIgZgBIgtgFQgggFgOgEQgOgFgJgFIgOgLQgLgKgEgGQgJgNgEgVQgEgTgCgrIgBg7IgCg9QAJAGALADQALADASADIBFAJIAwAHIAzACIAvACQAaABA0gCIAkgBQAagDArgIQAWgEALgDQAOgFAJgGIgCA4IgCAUIgMBYIgGAdQgEAPgJAKQgFAHgKAGQgeATgsAIQgeAFgyABIgxABIg8gBgABVhuIgCAAIABgMIAAgOIADAAIDWAAIAzABQAcABAWAFQAMACADAGQgEAHgQABQhNAFiaAAQg2AAgbgCgAFhiDIgDADIAAAFIABAEIACACQACADAEAAIAKABIANgBQAIAAAEgCQAEgBACgCQAAAAAAgBQABAAAAAAQAAgBAAAAQABgBAAgBQAAAAAAAAQAAgBgBAAQAAgBAAAAQAAgBgBAAIgGgEIgJgCIgagBQgDAAgDACgAjikOIgZgBIgugFQgfgFgPgEQgOgFgIgFIgOgLQgLgKgFgGQgJgOgDgUQgEgSgCgtIgCg6IgBg+QAIAFAMAEQAKADATADIBFAKIAvAFIA0AEIAuACQAaAAA0gCIAkgBQAbgDArgJQAVgDAMgDQANgFAJgGIgCA4IgBAUIgNBZIgFAdQgEAQgJAJQgGAGgKAHQgfATgqAIQgfAFgxABIgxABIg8gBgABpoOIgBAAIAAgMIAAgOIAEAAIDVAAIAzABQAcABAXAEQAMADADAGQgFAHgQABQhMAFiaABQg3gBgbgCgAF1ojIgDACIAAAGIACADIABADQACADAFAAIAJABIAOgBQAHgBAEgBQAEgBACgCQABAAAAgBQAAAAABAAQAAgBAAAAQAAgBAAgBQAAAAAAAAQAAgBAAAAQAAgBgBAAQAAgBAAAAIgHgEIgJgCIgZAAQgEgBgDACg");
	this.shape_12.setTransform(260.875,100.4);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#7F8082").s().p("AAMHDQgeAAg4gDQgVgBgLgCIgUgDIgYgDIhAgJIgVgEQgMgEgHgGQgEgDAAgDQgBgEADgDQAEgFAIgEQAXgLAYgCIAcgBIAigDIAhgEQATgBAfABIAxACIAdAAIAiACIAhADIAdABQAyACA5AUQAGADACADQADADgCADIgGAEIgDAFIgHAEIgUAGIgNADQgsAJguADQgdACgiAAIgYAAgAAMArQgeAAg4gDQgVgBgLgCIgUgDIgYgDIhAgJIgVgEQgMgEgHgGQgEgDAAgDQgBgDADgDQAEgFAIgEQAXgLAYgCIAcgBIAigDIAhgEQATgBAfABIAxACIAdAAIAiACIAhADIAdABQAyACA5AUQAGADACACQADADgCADIgGAEIgDAFIgHAEIgUAGIgNADQgsAJguADQgdADgiAAIgYgBgAAhl0QgfAAg3gDQgWgBgKgCIgVgDIgXgDIhAgJIgWgEQgLgEgIgGQgDgDgBgDQgBgEAEgDQAEgFAIgEQAXgLAXgCIAcgBIAigDIAigEQATgBAeABIAwACIAfAAIAhACIAiADIAdABQAxACA5AUQAHADACADQACADgCADIgFAEIgEAFIgGAEIgUAGIgNADQgtAJgtADQgdACgjAAIgXAAg");
	this.shape_13.setTransform(243.2083,85.375);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#000000").s().p("AkiJRIgfgEIgkgHIgDgBQgbgIgVgRQgWgTgIgZIgFgRQgDgRgBgeQgEhYgBg/QAAgIACgDQgBgJAGgJQAFgHAMgIQAUgLAggEIA3gEIAjgEQATgCAmABIBzADIAjAEIAcABQAuABA4ASQAMAEAGADQAJAGADAHIACABQADACABAEIADAAIDVAAIA0AAQAcACAWAEQANACAGAFQAFADACAEQACAFgBAFQgBAHgHAEQgFAEgIABQgMACgRABQg/ADiVABQg6AAgZgCIgCAvQgDAZgHAyIgEAZQgDAVgEAMQgFARgJALQgGAHgLAIQgXAQgeAJQgRAFgSADQgiAFg+AAIhEABQgwAAgXgDgAmwFyIACA6QACAtAEASQADAVAJANQAFAGALAKIAOALQAIAFAOAFQAPAFAfAEIAuAFIAZABQBBABAsgBQAxgBAfgFQArgHAegUQAKgGAGgHQAJgJAEgQIAFgdIANhZIABgUIACg4QgJAGgNAFQgMADgVAEQgrAIgbADIgkABQg0ACgaAAIgugCIg0gDIgvgGIhFgKQgTgDgKgDQgMgDgIgGIABA+gAkTD3IghAEIgiADIgcABQgYACgXALQgIAEgEAFQgDADABAEQAAADAEADQAHAGAMAEIAVAEIBAAJIAYADIAUADQALACAVABQA4ADAfAAQAwABAngDQAugDArgJIANgDIAUgGIAHgEIADgFIAGgEQACgDgDgDQgCgDgGgDQg4gUgygCIgdgBIghgDIgigCIgeAAIgxgCIgcgBIgWABgABXE1IAAAMIABAAQAbADA3AAQCagBBMgFQAQgBAFgHQgDgGgMgCQgXgFgcgBIgzgBIjVAAIgEAAgAFrE9QgFAAgCgDIgBgCIgCgEIAAgFIADgCQADgCAEAAIAZAAIAJACIAHAEQAAAAAAABQABAAAAABQAAAAAAABQAAAAAAABQAAAAAAABQAAAAgBABQAAAAAAAAQgBABAAAAQgCACgEABQgEACgHAAIgOABgAFnEyQABADADACIAGABQAFAAALgBIAKgBIACgCQgFgDgKAAIgPAAQgEAAgEABgAkiC5IgfgEIgkgHIgDgBQgbgIgVgRQgWgTgIgZIgFgRQgDgRgBgeQgEhXgBg/QAAgIACgDQgBgJAGgJQAFgHAMgIQAUgLAggEIA3gEIAjgEQATgCAmABIBzADIAjAEIAcABQAuABA4ASQAMAEAGADQAJAGADAHIACABQADACABAEIADAAIDVAAIA0AAQAcACAWAEQANACAGAFQAFADACAEQACAFgBAFQgBAHgHAEQgFAEgIABQgMACgRABQg/ADiVABQg6AAgZgCIgCAvQgDAZgHAxIgEAZQgDAVgEAMQgFARgJALQgGAHgLAIQgXAQgeAJQgRAFgSADQgiAFg+AAIhEABQgwAAgXgDgAmwglIACA5QACAtAEASQADAVAJANQAFAGALAKIAOALQAIAFAOAFQAPAFAfAEIAuAFIAZABQBBABAsgBQAxgBAfgFQArgHAegUQAKgGAGgHQAJgJAEgQIAFgdIANhYIABgUIACg4QgJAGgNAFQgMADgVAEQgrAIgbADIgkABQg0ACgaAAIgugCIg0gDIgvgGIhFgKQgTgDgKgDQgMgDgIgGIABA+gAkTigIghAEIgiADIgcABQgYACgXALQgIAEgEAFQgDADABAEQAAADAEADQAHAGAMAEIAVAEIBAAJIAYADIAUADQALACAVABQA4ADAfAAQAwABAngDQAugDArgJIANgDIAUgGIAHgEIADgFIAGgEQACgDgDgDQgCgDgGgDQg4gUgygCIgdgBIghgDIgigCIgeAAIgxgCIgcgBIgWABgABXhiIAAAMIABAAQAbADA3AAQCagBBMgFQAQgBAFgHQgDgGgMgCQgXgFgcgBIgzgBIjVAAIgEAAgAFrhaQgFAAgCgDIgBgCIgCgEIAAgFIADgCQADgCAEAAIAZAAIAJACIAHAEQAAAAAAABQABAAAAABQAAAAAAABQAAAAAAABQAAAAAAABQAAAAgBABQAAAAAAAAQgBABAAAAQgCACgEABQgEACgHAAIgOABgAFnhlQABADADACIAGABQAFAAALgBIAKgBIACgCQgFgDgKAAIgPAAQgEAAgEABgAkOjmIgfgEIgjgHIgEgBQgbgIgUgRQgWgTgJgZIgEgRQgDgRgCgeQgDhYgBg/QAAgIACgDQgBgJAGgJQAFgHAMgIQAUgLAggEIA2gEIAkgEQATgCAmABIByADIAkAEIAcABQAsABA6ASQAMAEAGADQAIAGAEAHIABABQADACABAEIAEAAIDVAAIAzAAQAcACAXAEQANACAGAFQAEADACAEQADAFgBAFQgBAHgHAEQgGAEgIABQgLACgSABQg/ADiVABQg6AAgZgCIgCAvQgCAZgIAyIgEAZQgDAVgDAMQgGARgJALQgGAHgKAIQgYAQgeAJQgQAFgTADQgiAFg+AAIhEABQgvAAgYgDgAmbnFIABA6QACAtAEASQAEAVAJANQAEAGALAKIAOALQAJAFAOAFQAOAFAgAEIAtAFIAZABQBCABArgBQAygBAegFQArgHAfgUQAKgGAFgHQAJgJAEgQIAGgdIAMhZIACgUIACg4QgJAGgOAFQgLADgWAEQgrAIgaADIgkABQg0ACgaAAIgvgCIgzgDIgwgGIhFgKQgSgDgLgDQgLgDgJgGIACA+gAj+pAIgiAEIgiADIgcABQgXACgXALQgIAEgEAFQgEADABAEQABADADADQAIAGALAEIAWAEIBAAJIAXADIAVADQAKACAWABQA4ADAfAAQAwABAngDQAtgDAsgJIANgDIAUgGIAGgEIAEgFIAFgEQACgDgCgDQgCgDgHgDQg5gUgwgCIgdgBIgigDIghgCIgfAAIgxgCIgcgBIgVABgABsoCIgBAMIACAAQAbADA2AAQCagBBNgFQAQgBAEgHQgDgGgMgCQgWgFgcgBIgzgBIjWAAIgDAAgAF/n6QgEAAgCgDIgCgCIgBgEIAAgFIADgCQADgCADAAIAaAAIAJACIAGAEQAAAAABABQAAAAAAABQAAAAABABQAAAAAAABQgBAAAAABQAAAAAAABQAAAAgBAAQAAABAAAAQgCACgEABQgEACgIAAIgNABgAF8oFQAAADADACIAGABQAGAAAKgBIAKgBIADgCQgFgDgKAAIgPAAQgFAAgDABg");
	this.shape_14.setTransform(260.5393,97.9929);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	// sugar
	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#32A0D4").s().p("AANBmIAAgCQgBgjgGgUQgHgSgMAAIAAAAIAABLIg+AAIAAjLIA+AAQAfAAAKACQALACAIAHQAJAIAFANQAEANAAAPQAAAfgPAPQAWAlAFA8gAgNgUIABAAQAJAAADgFQAEgEAAgLQAAgTgQgBIgBAAg");
	this.shape_15.setTransform(205,88.25);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#32A0D4").s().p("AAfBmIgIgiIgsAAIgIAiIg+AAIAxjLIBXAAIAvDLgAgKATIAVAAIgLgwg");
	this.shape_16.setTransform(186,88.25);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#32A0D4").s().p("AgaBiQgOgHgLgQQgLgQgEgUQgGgUAAgTQAAgvAXgdQAVgdAiABQAQAAASAHQASAHAOAOIgeA9QgRgOgQAAQgJABgHAHQgGAIAAAMQAAAaATAAIABAAIAAgfIA+AAIAABtIgBAAIgzACQgcAAgPgHg");
	this.shape_17.setTransform(168.1,88.2);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#32A0D4").s().p("AgeBeQgPgKgIgRQgJgQgDgUQgDgTAAgmIAAhNIA9AAIAABfQAAAMACAFQABAGAEgBQAFABABgHQACgGAAgSIAAhXIA9AAIAABNIgBAuQgBAPgGAQQgFARgKAMQgJALgMAHQgMAGgNAAQgPAAgPgKg");
	this.shape_18.setTransform(151.025,88.4);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#32A0D4").s().p("AhBBbIAQhFQAHAPAJAJQAKAJAJAAQAEAAADgDQADgEAAgFQAAgEgCgEQgCgEgFgCIgPgKQgQgKgHgMQgIgNABgTQAAhGBBAAQAeAAAaAOIgPBBQgIgPgIgIQgKgIgJAAQgFAAgCADQgDADAAAFQAAAGADAEQAEAEAOAIQAPAIAJAIQAIAHAFALQAEALABAQQAABFhDAAQgjAAgdgPg");
	this.shape_19.setTransform(135.25,88.225);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#ABE4F4").s().p("AHGDMIiOgUQhLgKgngDQgygEhlAAIjlABQhgAAgvAGQgbAEg1ALIicAgIAAgMQgIiTAEiLQABg2ADgsIALgEIATgJQAMgFATgDQB+gaDagFQDHgFCKAKICJAMQCVAQBJARIAIAAIADAiQAHBeAHB0QADA0AAAaQAAAYgCA9QgngOhJgMg");
	this.shape_20.setTransform(170.4475,89.9274);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#FFFEEC").s().p("AAlKbQiRgDiSgNIg8gGQgzgFgYgFIgngJIgDAAIgCgBQgJgGgPAHIgRAKIgRAJQgbAMgagBQgSgBgNgHQgGgEgBgEQgBgDADgHQATgpAbgzQAFgJAAgHQACgGgBgJQAAgSgEgXIgHgpQgGgigFgsQgJhFgBgiIAAg7IgBgVQAfgGBkgVQBTgRA1gFQAvgFBdAAIC3AAQBvABAoADQBBAECBASQBCAJAaAFQA0AJAnAMIAHABIAAAKQgFBdgEAvQgHBNgPA9QgDAQABAIIgDARIgBAIQgCADgBAEQAAAHAIAKIAlA1QAUAdgBARQgBAKgFAEQgGAFgOgBQghgDgwgMIgSgFIgUgIQgLgDgIAEQgGgBgFAEIgDABIitAaQhSAMgiABIg1ACIgfgBgAH6kdQhLgLg7gHQhqgMhWgGQjDgNj8AMQh8AGhTAOQgtAJgaALIgPAFIAGg7QAIhCAWhiQADgSgDgHIgDgFIgFgJIgqhCQgNgUAAgMQAAgFACgCQACgDAGgCQAIgDANABQAyACA5AXQAPAFAGgCIABgBIACABQAHABASgHQAegLA/gHQB8gNBTgEQBwgGBeAGQAlACArAFIDYAdIAOABIAAAAQAGADAKgCIAWgHIAWgIQAhgKAxAAQANAAAEAGQAGAGgGAPQgPAmgYAdQgJALgCAEIgCAFIgCAEQgBAEABAOQAOB4AKB4QgNgGgagEg");
	this.shape_21.setTransform(170.5292,97.7101);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#000000").s().p("AAxK7Ih0gEIhGgEIhggIQhDgFghgEQg4gHgsgJIgKgDIgBAAIgZAOQg1AcgxgOQgRgFgLgKQgNgLgBgQQAAgMAJgTIAohSIAGgKIgBgNQABgRgJguQgKgzgGhAIgJirIgFiCQgDiRAJiRQAEhEAHgsIAQhXIALg2IgFgHIgmg5QgQgZgDgMQgEgQAEgRQACgHAEgGQAFgIAMgEQAKgEAWgBQARAAAXADQAkAGAvARIAHADIAIgDQApgMA1gIQAigEA+gGQBhgIA7gCQBVgEBHADQBMAECTAUIBqAPIAKACIANgDIAbgJQAkgNA7gBQAOgBAJADQASAFAIAQQAIAQgEASQgBAJgHAOQgOAfgOASIgOASIgFAKIABAGQADAgAEBBIAIA5QAFAkAFBJIAHByQAKCCABBPQAEDMglDLQAAAFgBAGIgFAcIgBADIAcAmQASAYAFAKQANAbgDAVQgBANgHALQgIALgLAFQgJAEgQAAQgRAAgqgJIgegGIgWgHIgWgIIgBAAIgBABQgFADgNACIhWAOQhfAPgrAFQhJAIg7AAIgHAAgAmxJxIACABIADABIAnAIQAYAGAzAFIA8AFQCSANCRAEQAxABAjgCQAigCBSgMICtgaIADAAQAFgFAGABQAJgEAKADIAUAIIASAFQAwANAhACQAOABAGgEQAFgFABgJQABgSgUgdIglg0QgIgKAAgHQABgFACgDIABgIIADgRQgBgIADgQQAPg8AHhOQAEguAFheIAAgJIgHgCQgngLg0gJQgagFhCgKQiBgShBgEQgogChvgBIi3AAQhdAAgvAEQg1AFhTASQhjAVggAFIABAWIAAA7QABAiAJBFQAFAsAGAhIAHApQAEAYAAARQABAJgCAGQABAHgGAJQgbAzgTAqQgDAHABADQABADAGAFQANAGASABQAaACAbgMIARgKIARgJQAJgEAGAAQAFAAAEACgADFBeQAnADBLAKICOAUQBJALAnAOQACg9AAgXQAAgbgDgzQgHh0gHheIgDgiIgIgBQhJgQiVgQIiJgNQiKgKjHAGQjaAEh+AaQgTAEgMAFIgTAIIgLAEQgDAsgBA3QgECMAICRIAAAMICcggQA1gLAbgDQAvgHBgAAIDlAAQBlAAAyAEgAIhkTQgKh4gOh4QgBgNABgEIACgFIACgEQACgEAJgLQAYgdAPgmQAGgQgGgGQgEgFgNAAQgxAAghAKIgWAIIgWAGQgKACgGgCIAAAAIgOgBIjYgdQgrgFglgCQhegGhwAFQhTAFh8ANQg/AHgeALQgSAGgHgBIgCAAIgBAAQgGADgPgGQg5gWgygCQgNgBgIACQgGACgCADQgCADAAAEQAAANANAUIAqBBIAGAJIACAFQADAHgDASQgWBigIBCIgGA7IAPgFQAagLAtgIQBTgPB8gFQD8gNDDANQBWAGBqANQA7AGBLALQAaAEANAGIAAAAg");
	this.shape_22.setTransform(170.5077,97.6947);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(108.7,27.9,197.2,139.7);


(lib.sugar2_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// cups
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AgXAjIAAhFIAUAAQALAAAFACQAFABADAGQADAGAAAIQAAAKgFAHQgEAGgIAAQgEAAgFgGIAAAdgAgCgDIAAAAIABAAQABAAAAgBQABAAAAAAQABAAAAgBQABAAAAAAQABgDAAgDQAAgEgBgDQgBgBgEAAIAAAAg");
	this.shape.setTransform(252.45,101.95);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AgKAgQgFgDgDgGQgDgGgBgHIgBgSIAAgaIAVAAIAAAgIABAFQAAABAAAAQAAAAAAABQABAAAAAAQAAAAAAAAQAAAAAAAAQABAAAAAAQAAgBAAAAQABAAAAgBIAAgIIAAgdIAWAAIAAAaIgBAPIgCALQgCAFgDAEIgIAHQgEACgEAAQgFgBgFgDg");
	this.shape_1.setTransform(246.575,102);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AgPAaQgHgKAAgQQAAgOAIgLQAHgKALAAQAFAAAFACQAFACAEADIgJAZQgEgCgFAAQgFAAAAAFQAAAAAAABQAAAAAAABQAAAAAAABQAAAAAAABQACABADAAQAFAAAEgCIAJAaQgDACgFADQgGACgGAAQgKAAgIgKg");
	this.shape_2.setTransform(241.125,101.95);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#000000").s().p("AgKAkIAAg9IAVgJIAABGg");
	this.shape_3.setTransform(232.1,101.9);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#000000").s().p("AgXAjIAAhFIAUAAQALAAAFACQAFABADAGQADAGAAAIQAAALgFAFQgEAHgIAAQgEAAgFgGIAAAdgAgCgEIAAAAIABAAQABAAAAAAQABAAAAAAQABAAAAgBQABAAAAAAQABgCAAgFQAAgDgBgCQgBgCgEAAIAAAAg");
	this.shape_4.setTransform(252.45,142.75);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#000000").s().p("AgKAgQgFgDgDgGQgDgFgBgIIgBgTIAAgaIAVAAIAAAhIABAFQAAAAAAABQAAAAAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQABAAAAgBQAAAAAAAAQABgBAAAAIAAgIIAAgeIAWAAIAAAaIgBAQIgCAKQgCAGgDAEIgIAHQgEABgEAAQgFAAgFgDg");
	this.shape_5.setTransform(246.575,142.8);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#000000").s().p("AgPAaQgHgKAAgPQAAgQAIgKQAHgKALAAQAFAAAFACQAFACAEADIgJAZQgEgCgFAAQgFAAAAAFQAAAAAAABQAAAAAAABQAAAAAAABQAAAAAAAAQACACADAAQAFAAAEgCIAJAaQgDADgFACQgGACgGAAQgKAAgIgKg");
	this.shape_6.setTransform(241.125,142.75);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#000000").s().p("AgKAkIAAg+IAVgJIAABHg");
	this.shape_7.setTransform(232.1,142.7);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#B3B5B6").s().p("AjtFZIgYgBIgugFQgfgEgPgFQgOgFgIgFIgPgLQgKgKgFgGQgJgNgEgVQgDgSgCgtIgCg7IgCg9QAJAGALADQALADATACIBEAKIAwAGIAzADIAvADQAaAAA0gCIAkgCQAbgCAqgJQAWgDAMgEQANgEAJgGIgCA3IgBAVIgNBZIgFAdQgFAPgJAKQgFAGgKAHQgeAUgsAHQgeAFgyABIgxAAIg8AAgABfBZIgCAAIABgMIAAgPIAEAAIDVAAIAzABQAcACAXAFQALACADAGQgEAHgQABQhMAFibAAQg2AAgbgCgAFrBFIgDABIAAAGIACADIABACQACADAFABIAJABIANgBQAIgBAEgBQAEgBACgCQAAAAABgBQAAAAAAAAQABgBAAAAQAAgBAAAAQAAgBAAAAQAAgBAAAAQgBgBAAAAQAAgBgBAAIgGgEIgJgCIgZAAQgEAAgDACgAjtg+IgYgBIgugFQgfgFgPgEQgOgFgIgFIgPgLQgKgKgFgGQgJgNgEgVQgDgTgCgsIgCg7IgCg9QAJAGALADQALADATADIBEAJIAwAHIAzACIAvACQAaABA0gCIAkgBQAbgDAqgIQAWgEAMgDQANgFAJgGIgCA4IgBAUIgNBZIgFAdQgFAPgJAKQgFAHgKAGQgeATgsAIQgeAFgyABIgxABIg8gBgABfk+IgCAAIABgMIAAgOIAEAAIDVAAIAzABQAcABAXAFQALACADAGQgEAHgQABQhMAFibAAQg2AAgbgCgAFrlTIgDADIAAAFIACAEIABACQACADAFAAIAJABIANgBQAIAAAEgCQAEgBACgCQAAAAABgBQAAAAAAAAQABgBAAAAQAAgBAAgBQAAAAAAAAQAAgBAAAAQgBgBAAAAQAAgBgBAAIgGgEIgJgCIgZgBQgEAAgDACg");
	this.shape_8.setTransform(259.85,121.2);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#7F8082").s().p("AAXDzQgeAAg4gDQgWgBgKgCIgVgDIgXgDIhAgJIgWgEQgLgEgIgGQgDgDgBgDQgBgEAEgDQAEgFAIgEQAXgLAXgCIAcgBIAigDIAigEQATgBAeABIAwACIAfAAIAhACIAiADIAdABQAxACA5AUQAHADACADQACADgCADIgFAEIgEAFIgGAEIgUAGIgNADQgtAJgtADQgeACgiAAIgXAAgAAXikQgeAAg4gDQgWgBgKgCIgVgDIgXgDIhAgJIgWgEQgLgEgIgGQgDgDgBgDQgBgEAEgDQAEgFAIgEQAXgLAXgCIAcgBIAigDIAigEQATgBAeABIAwACIAfAAIAhACIAiADIAdABQAxACA5AUQAHADACADQACADgCADIgFAEIgEAFIgGAEIgUAGIgNADQgtAJgtADQgeADgiAAIgXgBg");
	this.shape_9.setTransform(242.1833,106.175);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#000000").s().p("AkYGBIgfgEIgkgHIgDgBQgbgIgVgRQgWgTgIgZIgFgRQgDgRgBgeQgEhYgBg/QAAgIACgDQgBgJAGgJQAFgHAMgIQAUgLAggEIA3gEIAjgEQATgCAmABIBzADIAjAEIAcABQAtABA5ASQAMAEAGADQAJAGADAHIACABQADACABAEIADAAIDVAAIA0AAQAcACAWAEQANACAGAFQAFADACAEQACAFgBAFQgBAHgHAEQgFAEgIABQgMACgRABQg/ADiVABQg6AAgZgCIgCAvQgDAZgHAyIgEAZQgDAVgEAMQgFARgJALQgGAHgLAIQgXAQgeAJQgRAFgSADQgiAFg+AAIhEABQgwAAgXgDgAmmCiIACA6QACAtAEASQADAVAJANQAFAGALAKIAOALQAIAFAOAFQAPAFAfAEIAuAFIAZABQBBABAsgBQAxgBAfgFQArgHAegUQAKgGAGgHQAJgJAEgQIAFgdIANhZIABgUIACg4QgJAGgNAFQgMADgVAEQgrAIgbADIgkABQg0ACgaAAIgugCIg0gDIgvgGIhFgKQgTgDgKgDQgMgDgIgGIABA+gAkJAnIghAEIgiADIgcABQgYACgXALQgIAEgEAFQgDADABAEQAAADAEADQAHAGAMAEIAVAEIBAAJIAYADIAUADQALACAVABQA4ADAfAAQAwABAngDQAugDArgJIANgDIAUgGIAHgEIADgFIAGgEQACgDgDgDQgCgDgGgDQg5gUgxgCIgdgBIghgDIgigCIgeAAIgxgCIgcgBIgWABgABhBlIAAAMIABAAQAbADA3AAQCagBBMgFQAQgBAFgHQgDgGgMgCQgXgFgcgBIgzgBIjVAAIgEAAgAF1BtQgFAAgCgDIgBgCIgCgEIAAgFIADgCQADgCAEAAIAZAAIAJACIAHAEQAAAAABABQAAAAAAABQAAAAAAABQAAAAAAABQAAAAAAABQAAAAAAABQgBAAAAAAQAAABgBAAQgCACgEABQgEACgHAAIgOABgAFxBiQABADADACIAGABQAFAAALgBIAKgBIACgCQgFgDgKAAIgPAAQgEAAgEABgAkYgWIgfgEIgkgHIgDgBQgbgIgVgRQgWgTgIgZIgFgRQgDgRgBgeQgEhYgBg/QAAgIACgDQgBgJAGgJQAFgHAMgIQAUgLAggEIA3gEIAjgEQATgCAmABIBzADIAjAEIAcABQAtABA5ASQAMAEAGADQAJAGADAHIACABQADACABAEIADAAIDVAAIA0AAQAcACAWAEQANACAGAFQAFADACAEQACAFgBAFQgBAHgHAEQgFAEgIABQgMACgRABQg/ADiVABQg6AAgZgCIgCAvQgDAZgHAyIgEAZQgDAVgEAMQgFARgJALQgGAHgLAIQgXAQgeAJQgRAFgSADQgiAFg+AAIhEABQgwAAgXgDgAmmj1IACA6QACAtAEASQADAVAJANQAFAGALAKIAOALQAIAFAOAFQAPAFAfAEIAuAFIAZABQBBABAsgBQAxgBAfgFQArgHAegUQAKgGAGgHQAJgJAEgQIAFgdIANhZIABgUIACg4QgJAGgNAFQgMADgVAEQgrAIgbADIgkABQg0ACgaAAIgugCIg0gDIgvgGIhFgKQgTgDgKgDQgMgDgIgGIABA+gAkJlwIghAEIgiADIgcABQgYACgXALQgIAEgEAFQgDADABAEQAAADAEADQAHAGAMAEIAVAEIBAAJIAYADIAUADQALACAVABQA4ADAfAAQAwABAngDQAugDArgJIANgDIAUgGIAHgEIADgFIAGgEQACgDgDgDQgCgDgGgDQg5gUgxgCIgdgBIghgDIgigCIgeAAIgxgCIgcgBIgWABgABhkyIAAAMIABAAQAbADA3AAQCagBBMgFQAQgBAFgHQgDgGgMgCQgXgFgcgBIgzgBIjVAAIgEAAgAF1kqQgFAAgCgDIgBgCIgCgEIAAgFIADgCQADgCAEAAIAZAAIAJACIAHAEQAAAAABABQAAAAAAABQAAAAAAABQAAAAAAABQAAAAAAABQAAAAAAABQgBAAAAAAQAAABgBAAQgCACgEABQgEACgHAAIgOABgAFxk1QABADADACIAGABQAFAAALgBIAKgBIACgCQgFgDgKAAIgPAAQgEAAgEABg");
	this.shape_10.setTransform(259.5143,118.7929);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	// sugar
	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#32A0D4").s().p("AANBmIAAgCQgBgjgGgUQgHgSgMAAIAAAAIAABLIg+AAIAAjLIA+AAQAfAAAKACQALACAIAHQAJAIAFANQAEANAAAPQAAAfgPAPQAWAlAFA8gAgNgUIABAAQAJAAADgFQAEgEAAgLQAAgTgQgBIgBAAg");
	this.shape_11.setTransform(205,88.25);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#32A0D4").s().p("AAfBmIgIgiIgsAAIgIAiIg+AAIAxjLIBXAAIAvDLgAgKATIAVAAIgLgwg");
	this.shape_12.setTransform(186,88.25);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#32A0D4").s().p("AgaBiQgOgHgLgQQgLgQgEgUQgGgUAAgTQAAgvAXgdQAVgdAiABQAQAAASAHQASAHAOAOIgeA9QgRgOgQAAQgJABgHAHQgGAIAAAMQAAAaATAAIABAAIAAgfIA+AAIAABtIgBAAIgzACQgcAAgPgHg");
	this.shape_13.setTransform(168.1,88.2);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#32A0D4").s().p("AgeBeQgPgKgIgRQgJgQgDgUQgDgTAAgmIAAhNIA9AAIAABfQAAAMACAFQABAGAEgBQAFABABgHQACgGAAgSIAAhXIA9AAIAABNIgBAuQgBAPgGAQQgFARgKAMQgJALgMAHQgMAGgNAAQgPAAgPgKg");
	this.shape_14.setTransform(151.025,88.4);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#32A0D4").s().p("AhBBbIAQhFQAHAPAJAJQAKAJAJAAQAEAAADgDQADgEAAgFQAAgEgCgEQgCgEgFgCIgPgKQgQgKgHgMQgIgNABgTQAAhGBBAAQAeAAAaAOIgPBBQgIgPgIgIQgKgIgJAAQgFAAgCADQgDADAAAFQAAAGADAEQAEAEAOAIQAPAIAJAIQAIAHAFALQAEALABAQQAABFhDAAQgjAAgdgPg");
	this.shape_15.setTransform(135.25,88.225);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#ABE4F4").s().p("AHGDMIiOgUQhLgKgngDQgygEhlAAIjlABQhgAAgvAGQgbAEg1ALIicAgIAAgMQgIiTAEiLQABg2ADgsIALgEIATgJQAMgFATgDQB+gaDagFQDHgFCKAKICJAMQCVAQBJARIAIAAIADAiQAHBeAHB0QADA0AAAaQAAAYgCA9QgngOhJgMg");
	this.shape_16.setTransform(170.4475,89.9274);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#FFFEEC").s().p("AAlKbQiRgDiSgNIg8gGQgzgFgYgFIgngJIgDAAIgCgBQgJgGgPAHIgRAKIgRAJQgbAMgagBQgSgBgNgHQgGgEgBgEQgBgDADgHQATgpAbgzQAFgJAAgHQACgGgBgJQAAgSgEgXIgHgpQgGgigFgsQgJhFgBgiIAAg7IgBgVQAfgGBkgVQBTgRA1gFQAvgFBdAAIC3AAQBvABAoADQBBAECBASQBCAJAaAFQA0AJAnAMIAHABIAAAKQgFBdgEAvQgHBNgPA9QgDAQABAIIgDARIgBAIQgCADgBAEQAAAHAIAKIAlA1QAUAdgBARQgBAKgFAEQgGAFgOgBQghgDgwgMIgSgFIgUgIQgLgDgIAEQgGgBgFAEIgDABIitAaQhSAMgiABIg1ACIgfgBgAH6kdQhLgLg7gHQhqgMhWgGQjDgNj8AMQh8AGhTAOQgtAJgaALIgPAFIAGg7QAIhCAWhiQADgSgDgHIgDgFIgFgJIgqhCQgNgUAAgMQAAgFACgCQACgDAGgCQAIgDANABQAyACA5AXQAPAFAGgCIABgBIACABQAHABASgHQAegLA/gHQB8gNBTgEQBwgGBeAGQAlACArAFIDYAdIAOABIAAAAQAGADAKgCIAWgHIAWgIQAhgKAxAAQANAAAEAGQAGAGgGAPQgPAmgYAdQgJALgCAEIgCAFIgCAEQgBAEABAOQAOB4AKB4QgNgGgagEg");
	this.shape_17.setTransform(170.5292,97.7101);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#000000").s().p("AAxK7Ih0gEIhGgEIhggIQhDgFghgEQg4gHgsgJIgKgDIgBAAIgZAOQg1AcgxgOQgRgFgLgKQgNgLgBgQQAAgMAJgTIAohSIAGgKIgBgNQABgRgJguQgKgzgGhAIgJirIgFiCQgDiRAJiRQAEhEAHgsIAQhXIALg2IgFgHIgmg5QgQgZgDgMQgEgQAEgRQACgHAEgGQAFgIAMgEQAKgEAWgBQARAAAXADQAkAGAvARIAHADIAIgDQApgMA1gIQAigEA+gGQBhgIA7gCQBVgEBHADQBMAECTAUIBqAPIAKACIANgDIAbgJQAkgNA7gBQAOgBAJADQASAFAIAQQAIAQgEASQgBAJgHAOQgOAfgOASIgOASIgFAKIABAGQADAgAEBBIAIA5QAFAkAFBJIAHByQAKCCABBPQAEDMglDLQAAAFgBAGIgFAcIgBADIAcAmQASAYAFAKQANAbgDAVQgBANgHALQgIALgLAFQgJAEgQAAQgRAAgqgJIgegGIgWgHIgWgIIgBAAIgBABQgFADgNACIhWAOQhfAPgrAFQhJAIg7AAIgHAAgAmxJxIACABIADABIAnAIQAYAGAzAFIA8AFQCSANCRAEQAxABAjgCQAigCBSgMICtgaIADAAQAFgFAGABQAJgEAKADIAUAIIASAFQAwANAhACQAOABAGgEQAFgFABgJQABgSgUgdIglg0QgIgKAAgHQABgFACgDIABgIIADgRQgBgIADgQQAPg8AHhOQAEguAFheIAAgJIgHgCQgngLg0gJQgagFhCgKQiBgShBgEQgogChvgBIi3AAQhdAAgvAEQg1AFhTASQhjAVggAFIABAWIAAA7QABAiAJBFQAFAsAGAhIAHApQAEAYAAARQABAJgCAGQABAHgGAJQgbAzgTAqQgDAHABADQABADAGAFQANAGASABQAaACAbgMIARgKIARgJQAJgEAGAAQAFAAAEACgADFBeQAnADBLAKICOAUQBJALAnAOQACg9AAgXQAAgbgDgzQgHh0gHheIgDgiIgIgBQhJgQiVgQIiJgNQiKgKjHAGQjaAEh+AaQgTAEgMAFIgTAIIgLAEQgDAsgBA3QgECMAICRIAAAMICcggQA1gLAbgDQAvgHBgAAIDlAAQBlAAAyAEgAIhkTQgKh4gOh4QgBgNABgEIACgFIACgEQACgEAJgLQAYgdAPgmQAGgQgGgGQgEgFgNAAQgxAAghAKIgWAIIgWAGQgKACgGgCIAAAAIgOgBIjYgdQgrgFglgCQhegGhwAFQhTAFh8ANQg/AHgeALQgSAGgHgBIgCAAIgBAAQgGADgPgGQg5gWgygCQgNgBgIACQgGACgCADQgCADAAAEQAAANANAUIAqBBIAGAJIACAFQADAHgDASQgWBigIBCIgGA7IAPgFQAagLAtgIQBTgPB8gFQD8gNDDANQBWAGBqANQA7AGBLALQAaAEANAGIAAAAg");
	this.shape_18.setTransform(170.5077,97.6947);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(108.7,27.9,195.10000000000002,139.7);


(lib.sugar1_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// cups
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AgXAjIAAhFIAUAAQALAAAFACQAFABADAGQADAGAAAIQAAALgFAFQgEAHgIAAQgEAAgFgGIAAAdgAgCgEIAAAAIABAAQABAAAAAAQABAAAAAAQABAAAAgBQABAAAAAAQABgCAAgFQAAgDgBgCQgBgCgEAAIAAAAg");
	this.shape.setTransform(252.45,142.75);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AgKAgQgFgDgDgGQgDgFgBgIIgBgTIAAgaIAVAAIAAAhIABAFQAAAAAAABQAAAAAAAAQABABAAAAQAAAAAAAAQAAAAAAAAQABAAAAgBQAAAAAAAAQABgBAAAAIAAgIIAAgeIAWAAIAAAaIgBAQIgCAKQgCAGgDAEIgIAHQgEABgEAAQgFAAgFgDg");
	this.shape_1.setTransform(246.575,142.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AgPAaQgHgKAAgPQAAgQAIgKQAHgKALAAQAFAAAFACQAFACAEADIgJAZQgEgCgFAAQgFAAAAAFQAAAAAAABQAAAAAAABQAAAAAAABQAAAAAAAAQACACADAAQAFAAAEgCIAJAaQgDADgFACQgGACgGAAQgKAAgIgKg");
	this.shape_2.setTransform(241.125,142.75);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#000000").s().p("AgKAkIAAg+IAVgJIAABHg");
	this.shape_3.setTransform(232.1,142.7);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#B3B5B6").s().p("AjtCNIgYgBIgugFQgfgEgPgFQgOgFgIgFIgPgLQgKgKgFgGQgJgNgEgVQgDgSgCgsIgCg7IgCg9QAJAGALADQALADATACIBEAKIAwAGIAzADIAvADQAaAAA0gCIAkgCQAbgCAqgJQAWgDAMgEQANgEAJgGIgCA3IgBAVIgNBYIgFAdQgFAPgJAKQgFAGgKAHQgeAUgsAHQgeAFgyABIgxAAIg8AAgABfhyIgCAAIABgMIAAgPIAEAAIDVAAIAzABQAcACAXAFQALACADAGQgEAHgQABQhMAFibAAQg2AAgbgCgAFriGIgDACIAAAFIACADIABACQACADAFABIAJABIANgBQAIgBAEgBQAEgBACgCQAAAAABgBQAAAAAAAAQABgBAAAAQAAgBAAAAQAAgBAAAAQAAgBAAAAQgBgBAAAAQAAgBgBAAIgGgEIgJgCIgZAAQgEAAgDACg");
	this.shape_4.setTransform(259.85,141.6);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#7F8082").s().p("AAXAnQgeAAg4gDQgWgBgKgCIgVgDIgXgDIhAgJIgWgEQgLgEgIgGQgDgDgBgCQgBgEAEgDQAEgFAIgEQAXgLAXgCIAcgBIAigDIAigEQATgBAeABIAwACIAfAAIAhACIAiADIAdABQAxACA5AUQAHADACADQACACgCADIgFAEIgEAFIgGAEIgUAGIgNADQgtAJgtADQgeACgiAAIgXAAg");
	this.shape_5.setTransform(242.1833,126.575);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#000000").s().p("AkYC1IgfgEIgkgHIgDgBQgbgIgVgRQgWgTgIgZIgFgRQgDgRgBgeQgEhXgBg/QAAgIACgDQgBgJAGgJQAFgHAMgIQAUgLAggEIA3gEIAjgEQATgCAmABIBzADIAjAEIAcABQAtABA5ASQAMAEAGADQAJAGADAHIACABQADACABAEIADAAIDVAAIA0AAQAcACAWAEQANACAGAFQAFADACAEQACAFgBAFQgBAHgHAEQgFAEgIABQgMACgRABQg/ADiVABQg6AAgZgCIgCAvQgDAZgHAxIgEAZQgDAVgEAMQgFARgJALQgGAHgLAIQgXAQgeAJQgRAFgSADQgiAFg+AAIhEABQgwAAgXgDgAmmgpIACA5QACAtAEASQADAVAJANQAFAGALAKIAOALQAIAFAOAFQAPAFAfAEIAuAFIAZABQBBABAsgBQAxgBAfgFQArgHAegUQAKgGAGgHQAJgJAEgQIAFgdIANhYIABgUIACg4QgJAGgNAFQgMADgVAEQgrAIgbADIgkABQg0ACgaAAIgugCIg0gDIgvgGIhFgKQgTgDgKgDQgMgDgIgGIABA+gAkJikIghAEIgiADIgcABQgYACgXALQgIAEgEAFQgDADABAEQAAADAEADQAHAGAMAEIAVAEIBAAJIAYADIAUADQALACAVABQA4ADAfAAQAwABAngDQAugDArgJIANgDIAUgGIAHgEIADgFIAGgEQACgDgDgDQgCgDgGgDQg5gUgxgCIgdgBIghgDIgigCIgeAAIgxgCIgcgBIgWABgABhhmIAAAMIABAAQAbADA3AAQCagBBMgFQAQgBAFgHQgDgGgMgCQgXgFgcgBIgzgBIjVAAIgEAAgAF1heQgFAAgCgDIgBgCIgCgEIAAgFIADgCQADgCAEAAIAZAAIAJACIAHAEQAAAAABABQAAAAAAABQAAAAAAABQAAAAAAABQAAAAAAABQAAAAAAABQgBAAAAAAQAAABgBAAQgCACgEABQgEACgHAAIgOABgAFxhpQABADADACIAGABQAFAAALgBIAKgBIACgCQgFgDgKAAIgPAAQgEAAgEABg");
	this.shape_6.setTransform(259.5143,139.1929);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	// sugar
	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#32A0D4").s().p("AANBmIAAgCQgBgjgGgUQgHgSgMAAIAAAAIAABLIg+AAIAAjLIA+AAQAfAAAKACQALACAIAHQAJAIAFANQAEANAAAPQAAAfgPAPQAWAlAFA8gAgNgUIABAAQAJAAADgFQAEgEAAgLQAAgTgQgBIgBAAg");
	this.shape_7.setTransform(205,88.25);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#32A0D4").s().p("AAfBmIgIgiIgsAAIgIAiIg+AAIAxjLIBXAAIAvDLgAgKATIAVAAIgLgwg");
	this.shape_8.setTransform(186,88.25);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#32A0D4").s().p("AgaBiQgOgHgLgQQgLgQgEgUQgGgUAAgTQAAgvAXgdQAVgdAiABQAQAAASAHQASAHAOAOIgeA9QgRgOgQAAQgJABgHAHQgGAIAAAMQAAAaATAAIABAAIAAgfIA+AAIAABtIgBAAIgzACQgcAAgPgHg");
	this.shape_9.setTransform(168.1,88.2);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#32A0D4").s().p("AgeBeQgPgKgIgRQgJgQgDgUQgDgTAAgmIAAhNIA9AAIAABfQAAAMACAFQABAGAEgBQAFABABgHQACgGAAgSIAAhXIA9AAIAABNIgBAuQgBAPgGAQQgFARgKAMQgJALgMAHQgMAGgNAAQgPAAgPgKg");
	this.shape_10.setTransform(151.025,88.4);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#32A0D4").s().p("AhBBbIAQhFQAHAPAJAJQAKAJAJAAQAEAAADgDQADgEAAgFQAAgEgCgEQgCgEgFgCIgPgKQgQgKgHgMQgIgNABgTQAAhGBBAAQAeAAAaAOIgPBBQgIgPgIgIQgKgIgJAAQgFAAgCADQgDADAAAFQAAAGADAEQAEAEAOAIQAPAIAJAIQAIAHAFALQAEALABAQQAABFhDAAQgjAAgdgPg");
	this.shape_11.setTransform(135.25,88.225);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#ABE4F4").s().p("AHGDMIiOgUQhLgKgngDQgygEhlAAIjlABQhgAAgvAGQgbAEg1ALIicAgIAAgMQgIiTAEiLQABg2ADgsIALgEIATgJQAMgFATgDQB+gaDagFQDHgFCKAKICJAMQCVAQBJARIAIAAIADAiQAHBeAHB0QADA0AAAaQAAAYgCA9QgngOhJgMg");
	this.shape_12.setTransform(170.4475,89.9274);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#FFFEEC").s().p("AAlKbQiRgDiSgNIg8gGQgzgFgYgFIgngJIgDAAIgCgBQgJgGgPAHIgRAKIgRAJQgbAMgagBQgSgBgNgHQgGgEgBgEQgBgDADgHQATgpAbgzQAFgJAAgHQACgGgBgJQAAgSgEgXIgHgpQgGgigFgsQgJhFgBgiIAAg7IgBgVQAfgGBkgVQBTgRA1gFQAvgFBdAAIC3AAQBvABAoADQBBAECBASQBCAJAaAFQA0AJAnAMIAHABIAAAKQgFBdgEAvQgHBNgPA9QgDAQABAIIgDARIgBAIQgCADgBAEQAAAHAIAKIAlA1QAUAdgBARQgBAKgFAEQgGAFgOgBQghgDgwgMIgSgFIgUgIQgLgDgIAEQgGgBgFAEIgDABIitAaQhSAMgiABIg1ACIgfgBgAH6kdQhLgLg7gHQhqgMhWgGQjDgNj8AMQh8AGhTAOQgtAJgaALIgPAFIAGg7QAIhCAWhiQADgSgDgHIgDgFIgFgJIgqhCQgNgUAAgMQAAgFACgCQACgDAGgCQAIgDANABQAyACA5AXQAPAFAGgCIABgBIACABQAHABASgHQAegLA/gHQB8gNBTgEQBwgGBeAGQAlACArAFIDYAdIAOABIAAAAQAGADAKgCIAWgHIAWgIQAhgKAxAAQANAAAEAGQAGAGgGAPQgPAmgYAdQgJALgCAEIgCAFIgCAEQgBAEABAOQAOB4AKB4QgNgGgagEg");
	this.shape_13.setTransform(170.5292,97.7101);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#000000").s().p("AAxK7Ih0gEIhGgEIhggIQhDgFghgEQg4gHgsgJIgKgDIgBAAIgZAOQg1AcgxgOQgRgFgLgKQgNgLgBgQQAAgMAJgTIAohSIAGgKIgBgNQABgRgJguQgKgzgGhAIgJirIgFiCQgDiRAJiRQAEhEAHgsIAQhXIALg2IgFgHIgmg5QgQgZgDgMQgEgQAEgRQACgHAEgGQAFgIAMgEQAKgEAWgBQARAAAXADQAkAGAvARIAHADIAIgDQApgMA1gIQAigEA+gGQBhgIA7gCQBVgEBHADQBMAECTAUIBqAPIAKACIANgDIAbgJQAkgNA7gBQAOgBAJADQASAFAIAQQAIAQgEASQgBAJgHAOQgOAfgOASIgOASIgFAKIABAGQADAgAEBBIAIA5QAFAkAFBJIAHByQAKCCABBPQAEDMglDLQAAAFgBAGIgFAcIgBADIAcAmQASAYAFAKQANAbgDAVQgBANgHALQgIALgLAFQgJAEgQAAQgRAAgqgJIgegGIgWgHIgWgIIgBAAIgBABQgFADgNACIhWAOQhfAPgrAFQhJAIg7AAIgHAAgAmxJxIACABIADABIAnAIQAYAGAzAFIA8AFQCSANCRAEQAxABAjgCQAigCBSgMICtgaIADAAQAFgFAGABQAJgEAKADIAUAIIASAFQAwANAhACQAOABAGgEQAFgFABgJQABgSgUgdIglg0QgIgKAAgHQABgFACgDIABgIIADgRQgBgIADgQQAPg8AHhOQAEguAFheIAAgJIgHgCQgngLg0gJQgagFhCgKQiBgShBgEQgogChvgBIi3AAQhdAAgvAEQg1AFhTASQhjAVggAFIABAWIAAA7QABAiAJBFQAFAsAGAhIAHApQAEAYAAARQABAJgCAGQABAHgGAJQgbAzgTAqQgDAHABADQABADAGAFQANAGASABQAaACAbgMIARgKIARgJQAJgEAGAAQAFAAAEACgADFBeQAnADBLAKICOAUQBJALAnAOQACg9AAgXQAAgbgDgzQgHh0gHheIgDgiIgIgBQhJgQiVgQIiJgNQiKgKjHAGQjaAEh+AaQgTAEgMAFIgTAIIgLAEQgDAsgBA3QgECMAICRIAAAMICcggQA1gLAbgDQAvgHBgAAIDlAAQBlAAAyAEgAIhkTQgKh4gOh4QgBgNABgEIACgFIACgEQACgEAJgLQAYgdAPgmQAGgQgGgGQgEgFgNAAQgxAAghAKIgWAIIgWAGQgKACgGgCIAAAAIgOgBIjYgdQgrgFglgCQhegGhwAFQhTAFh8ANQg/AHgeALQgSAGgHgBIgCAAIgBAAQgGADgPgGQg5gWgygCQgNgBgIACQgGACgCADQgCADAAAEQAAANANAUIAqBBIAGAJIACAFQADAHgDASQgWBigIBCIgGA7IAPgFQAagLAtgIQBTgPB8gFQD8gNDDANQBWAGBqANQA7AGBLALQAaAEANAGIAAAAg");
	this.shape_14.setTransform(170.5077,97.6947);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(108.7,27.9,195.10000000000002,139.7);


(lib.justsugar_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#32A0D4").s().p("AAMBmIAAgBQABglgIgSQgFgUgNABIgBAAIAABLIg+AAIAAjMIA+AAQAgAAAKADQALACAIAIQAIAHAGANQAEANAAAPQAAAfgQAOQAXAmAEA8gAgOgUIACAAQAJAAADgEQAEgGAAgKQAAgUgRABIgBAAg");
	this.shape.setTransform(196.5,51.05);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#32A0D4").s().p("AAfBmIgIgjIgsAAIgIAjIg/AAIAyjMIBYAAIAvDMgAgKAUIAVAAIgKgyg");
	this.shape_1.setTransform(177.5,51.05);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#32A0D4").s().p("AgZBiQgPgHgLgRQgLgQgFgTQgEgTAAgUQAAgvAVgdQAWgdAhAAQARAAASAIQASAHAPAOIgeA9QgSgNgPAAQgLgBgGAJQgHAHAAAMQAAAaAUAAIACAAIAAgfIA9AAIAABuIgBAAIgyACQgdgBgOgHg");
	this.shape_2.setTransform(159.6,51);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#32A0D4").s().p("AgeBeQgPgKgIgQQgJgRgDgTQgDgUAAgmIAAhNIA9AAIAABfQAAALACAGQABAFAEAAQAFAAABgGQACgGAAgTIAAhWIA9AAIAABMIgBAwQgBAPgGAPQgFARgKALQgJAMgMAGQgMAHgNAAQgPAAgPgKg");
	this.shape_3.setTransform(142.525,51.2);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#32A0D4").s().p("AhABbIAPhFQAGAPAKAJQAKAJAIAAQAFAAADgDQADgEAAgFQAAgEgCgEQgDgEgEgCIgOgKQgRgKgHgMQgIgNAAgTQABhGBCAAQAdAAAaAOIgQBBQgGgPgKgIQgJgIgJAAQgFAAgDADQgDADAAAFQABAGADAEQAEAEAPAIQAPAIAHAIQAIAHAGALQAEALAAAQQAABFhCAAQgiAAgdgPg");
	this.shape_4.setTransform(126.75,51.025);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#ABE4F4").s().p("AHGDMIiOgUQhLgKgngDQgygEhlAAIjlABQhgAAgvAGQgbAEg1ALIicAgIAAgMQgIiTAEiLQABg2ADgsIALgEIATgJQAMgFATgDQB+gaDagFQDHgFCKAKICJAMQCVAQBJARIAIABIADAhQAHBeAHB0QADA0AAAaQAAAYgCA9QgngOhJgMg");
	this.shape_5.setTransform(161.9493,52.7274);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#FFFEEC").s().p("AAlKbQiRgDiSgNIg8gGQgzgFgYgFIgngJIgDAAIgCgBQgJgGgPAHIgRAKIgRAJQgbAMgagBQgSgBgNgHQgGgEgBgEQgBgDADgHQATgpAbgzQAFgKAAgGQACgGgBgJQAAgSgEgXIgHgpQgGgigFgsQgJhFgBgiIAAg7IgBgVQAfgGBkgVQBTgRA1gFQAvgFBdAAIC3AAQBvABAoADQBBAECBASQBCAJAaAFQA0AJAnAMIAHABIAAAKQgFBdgEAvQgHBNgPA9QgDAQABAIIgDARIgBAIQgCADgBAEQAAAHAIAKIAlA1QAUAdgBARQgBAKgFAEQgGAFgOgBQghgDgwgMIgSgFIgUgIQgLgDgIAEQgGgBgFAEIgDABIitAaQhSAMgiABIg1ACIgfgBgAH6kdQhLgLg7gHQhqgMhWgGQjDgNj8AMQh8AGhTAOQgtAJgaALIgPAFQACghAEgaQAIhCAWhiQADgSgDgHIgCgFIgGgJIgqhCQgNgUAAgMQAAgFACgCQACgDAGgCQAIgDANABQAyACA5AXQAPAFAGgCIABgBIACABQAHABASgHQAegLA/gHQB8gNBTgEQBwgGBeAGQAlACArAFIDYAdQAIACAGgBQAGADAKgCIAWgHIAWgIQAhgKAxAAQANAAAEAGQAGAGgGAPQgPAmgYAdQgJALgCAEIgCAFIgCAEQgBAEABAOQAOB4AKB4QgNgGgagEg");
	this.shape_6.setTransform(162.0292,60.5101);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#000000").s().p("AAxK7Ih0gEIhGgEIhggIQhDgFghgEQg4gHgsgJIgKgDIgBAAIgZAOQg1AcgxgOQgRgFgLgKQgNgLgBgQQAAgMAJgTIAohSIAGgKIgBgNQABgRgJguQgKgzgGhAIgJirIgFiCQgDiRAJiRQAEhEAHgsIAQhXIALg1IgFgIIgmg5QgQgZgDgMQgEgQAEgRQACgHAEgGQAFgIAMgEQAKgEAWgBQARAAAXADQAkAGAvARIAHAEIAIgEQApgMA1gIQAigEA+gGQBhgIA7gCQBVgEBHADQBMAECTAUIBqAPIAKACQAFgCAIgBIAbgJQAkgNA7gBQAOgBAJADQASAFAIAQQAIAQgEASQgBAJgHAOQgOAfgOASIgOASIgFAKIABAGQADAgAEBBIAIA5QAFAkAFBJIAHByQAKCCABBPQAEDMglDLQAAAFgBAGIgFAcIgBADIAcAmQASAYAFAKQANAbgDAVQgBANgHALQgIALgLAFQgJAEgQAAQgRAAgqgJIgegGIgWgHIgWgIIgBAAIgBABQgFADgNACIhWAOQhfAPgrAFQhJAIg7AAIgHAAgAmxJxIACACIADAAIAnAIQAYAGAzAFIA8AFQCSANCRAEQAxABAjgCQAigCBSgMICtgaIADAAQAFgFAGABQAIgEALADIAUAIIASAFQAwANAhACQAOABAGgEQAFgFABgJQABgSgUgdIglg0QgIgKAAgHQABgFACgDIABgIIADgQQgBgIADgRQAPg8AHhOQAEguAFheIAAgJIgHgCQgngLg0gJQgagFhCgKQiBgShBgEQgogChvgBIi3AAQhdAAgvAEQg1AFhTASQhkAVgfAFIABAWIAAA7QABAiAJBFQAFAsAGAhIAHApQAEAYAAARQABAJgCAGQAAAHgFAJQgbAzgTAqQgDAHABADQABADAGAFQANAGASABQAaACAbgMIARgKIARgJQAJgEAGAAQAFAAAEACgADFBeQAnADBLAKICOAUQBJALAnAOQACg9AAgXQAAgbgDgzQgHh0gHheIgDgiIgIgBQhJgQiVgQIiJgNQiKgKjHAGQjaAEh+AaQgTAEgMAFIgTAIIgLAEQgDAtgBA2QgECMAICRIAAANICcghQA1gLAbgDQAvgHBgAAIDlAAQBlAAAyAEgAIhkTQgKh4gOh4QgBgNABgEIACgEIACgFQACgEAJgLQAYgdAPgmQAGgQgGgGQgEgFgNAAQgxAAghAKIgWAIIgWAGQgKACgGgCQgGAAgIgBIjYgdQgrgFglgCQhegGhwAFQhTAFh8ANQg/AHgeALQgSAGgHgBIgCAAIgBAAQgGADgPgGQg5gWgygCQgNgBgIACQgGACgCADQgCADAAAEQAAANANAUIAqBBIAGAKIACAEQADAHgDASQgWBigIBCQgEAbgCAhIAPgGQAagLAtgIQBTgPB8gFQD8gNDDANQBWAGBqANQA7AGBLALQAaAFANAFIAAAAg");
	this.shape_7.setTransform(162.0077,60.4947);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(100.2,-9.3,123.60000000000001,139.70000000000002);


(lib.Person_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#CC6699").s().p("AniGoQjVgDhqgDIlkgMQjGgGiRAIQAMggAOg8QAPhDAKgcQAOgoAgg4QAuhSAngzQA0hFA6grQAcgUAZgLQAVgKA2gQQA1gQBOgdICDgxQAwgRBhggQBhgfAwgRQA7gVBFgdQAgBJAXAnQAmA/AuAkQAsAjBLAbQBbAgBKAEQBcAGBKgjQBVgpBJhqQAvhFAVhAIACgJIAcAMIAmARQASAIA/AWQBUAcC3BEIEvByQBFAbApAXQA7AfAlAoQArArAeBEQAWAwAYBQQAlB7AFBKIAAADIgCAAQhDAPhXADQgqAChzgCQi/gDkgAEInfAHIhmAAQjVAAmNgEgASeg3QgHAFgKAQQgMAUgTAZIghAsQgsA7gxBPQgZApg7BlQgHAOgBAFQgBANAKAEQAIAEAJgIQAFgEAFgLQBTigCkjYQANgSgGgJQgDgGgIAAIgDgBQgFAAgFADgAyThAQgIAFAAAHQAAAIAOAMQANAKAWAWQAvA0A0BZQBDBwAgBXQAHAPAEAFQAFAEAFABQAHACAEgDQAJgGgCgMQgBgGgHgMQgLgUgNgdIgWgxQg+iIh7iNQgOgQgKgDIgFgBQgFAAgFADg");
	this.shape.setTransform(343.5625,401.1911);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFD56C").s().p("A2kbrQgGgGgKgBQgpgJgVgGQgjgIgagKQh0gshWhyQiBiqgPkPQBsAQAbACQBMAEA3gWQBDgbBChSQAhgqAQgkQAPgkAMhCQAgi3ANkRQADhAgBggIgFhZQgEhQADhuIAGiyIABgKQAJlNB9lFQB6k8DWkMQBBhRA5g1QCYiMDRg2QDSg1DIAyIAnAJIAAABIAEAAIAFABIgBgCIAngJQDJgzDRA2QDRA1CYCMQA5A1BCBSQDWELB5E8QB9FFAJFNIABALIAHCyQACBtgEBQIgFBZQgBAgADBAQAOERAfC3QAMBDAPAkQARAkAhApQBBBTBDAbQA3AWBNgFQAbgCBsgQQgQEQiBCqQhWBxh0AsQgaAKgjAIQgUAGgqAJQgGABgFADQgJgagJgRQgOgfghguQgYgggPgRQgYgYgdgUQgvghhMgfIhWggImnieIhWgeIgygQQgdgKgUgKIgggRQgTgKgPgCIgIgBIgCgEQgMgegEgwQgEg2gDgaIgHgzQgBgPACgrQAChAgEiCIAAgKIBbhEQBMg7BJg/QBOhBBAhNQAfglAXgqQAuhVAXhhQALgxAIgxIAMAGQANAKAQAEIAFABIAAAHQAAALACAGQABADAIAJQASATAPAEIAPABIASAAQAKAAAFgCQAFgBAHgHQAVgXAAgeIAEgCQAXgNAYgTQAOgMAGgHQAMgNAFgIQAshAAIhOQABgQAEgKIAEgMIAAAAIAYAIQAxAPAegCQARgBACgKQABgHgHgFQgGgEgJgCQi/gkhrhWIgHgGIgEgEIgEgCQgXgVgQgUQgUgbgXgtQhCiGgUiEQAfANAgAKQB/ArCFALQAMACAFgFQAFgEgCgHQgBgHgFgEQgGgFgTgCQiogPiYhCQgDgEgFgCIgGAAQgugVgsgZQhXgxhehMQhCg1hkhcQhxhog7hFQgYgdgVgcQgBgGgEgDIgCgBQgxhFgbhEQgEgLgGgFQgIgIgIADQgHADAAAKQgBAJAEAJQAeBJA0BJQgRA3gnA+QgiA0gjAkQhPBNiOAxQgtAQhOAVQhZAZgiALQgnAMhmAnQhuAqg2AXQhaAmhFAnQhxBAhKBMQgYAZgPAVQgIAKgCAIQgBAGACAFQADAFAFACQALADAMgSQAgguBAgzQBhhOBvg0IAAAMQADAjgTA+QgdBegiA/QgsBSg9AxQggAagmASQhjAzhxAEQgTAAgJAGQgGAEAAAIQgBAJAGADQADACAJAAQA6gBA2gMIgBACQgBAJAFAPIANAqQAHAaAIAQQAGALANATIAUAdIAKARQAGAIAKAJQAcAZAbALIAIACQgBAJABALQACANADAGQADAGAGAGQANAOAJAEQAHACANACQAWACAJgEQAFgDAFgFQAUgSAEgTIABgKIAJgCQAMgEAGgFIAIgFIAIgEIAiCQQAWBfAyBOIA1BTQBABhBhBEIDYCFQgFAGAAANQgBBfgOB1QgIBHgVCMQgEAagGALIgBABQgHACgLAEQhWAoiaAyQixA5hBAaQhUAigOAEIhxAjQhCAVgoAaQgdAUgfAdQgmAlgZAeQghApgmA/IgcAvIgDgEg");
	this.shape_1.setTransform(344.625,234.5739);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#609DCB").s().p("APbEcQgIAAgEgCIgIgGQgGgGgBgDQgCgEAAgHQAAgQAGgIQADgEAEgCIAHAAQANAAAIACQAHACAHAFQAGADADAEQAEAGgDAKQgDALgEAHQgCAFgEACIgHABgAv5EGQgGgIAAgJQAAgHADgIQACgLAFgFQAIgIASACQAIABAEADQALAFADALQADALgDAKQgDAIgEAGQgDAGgFADQgFACgGAAIgDAAQgRAAgKgMgAnUhnQgIgBgUgIIgSgKQgIgHgGgKQgHgKgDgLQgEgJAAgKQgCgQAFgQQAFgQAMgUQAGgLAGgGQAFgEALgGIANgGQAGgBAJABQAZABARAKQAeARAJAkQADAMAAALQABAQgDAKQgCAKgKATQgGAMgGAEQgDADgKAEQgbAMgQAAIgEAAgAngjsQgLAFgHAKQgIALgBAMQgCANAFAMQAFALAJAIQALAJAOACQAPACAMgGIAJgEQAKgHAFgMQAGgMgBgMQAAgMgHgLQgGgLgLgHQgKgGgNAAIgDAAQgLAAgKAFgAG1hpQgIgBgUgIIgSgKQgIgHgGgKQgHgKgDgLQgDgJgBgJQgCgQAFgRQAFgQAMgUQAGgLAGgGQAFgEALgGIANgGQAGgBAJABQAZABARAKQAeARAJAkQADAMAAALQABAQgDAKQgCAKgKATQgGAMgGAEQgDADgKAEQgbAMgQAAIgEAAgAG2jzQgOABgKAIQgLAIgFANQgGANACAMQACAOAJAKQAIALAMAFQAMAFAOgCQAOgDAKgIIAHgHIAEgGQAIgPgBgPQgBgNgIgLQgIgLgMgFQgKgFgKAAIgGABg");
	this.shape_2.setTransform(345.5942,214.93);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AGLDjQgqgXgWgoQgLgVgIgcQgEgTgGgiQgNhRgDgqQgGhGALg3QADgNgEgGQBCgUBngLQAugFARABQARAAAuAGQAAAFACAEIAFAFIAHAFQAHAGAHAOQAhBDAHBNQAIBLgRBLQgNA4gaAfQgTAWgfAPQglAUgkADIgMAAQgnAAgkgTgAGziYIgCABQgHABgIAEQgVAKgQAcQgOAZgCAcQgBAdAMAYQAIANAKAJIAFAEQAJAHALAEQAIAEAKACIAKACQAMABAQgDQAMgDANgGQAMgFAHgGQAFgFAFgJIAEgHQAIgSADgLQACgIgBgPQABgRgFgPIgDgIQgGgTgQgPIgGgGIgBAAQgYgUgegBIgEAAQgJAAgHABgAnhDxQgjgDgmgUQgfgPgTgWQgbgfgMg4QgRhLAIhLQAIhNAghDQAGgOAIgGIAHgFIAFgFQADgEgBgFQAugGARAAQARgBAvAFQBmALBCAUQgEAGADANQALA3gGBGQgDAqgNBRQgGAigEATQgIAcgLAVQgWAogqAXQgkATgnAAIgMAAgAnJAtQALABARgDQAMgDANgGQALgFAHgGQAFgFAFgJIAFgHQAEgFACgGQAPgmgPgnIgBgEQgHgTgQgPIgGgGIAAAAQgPgNgTgGQgNgFgJAAQgKAAgLAFQgHABgIAEQgVAKgQAcQgOAZgBAcQgCAdANAYQAGANAMAJIAEAEIAAAAQAIAIALAEQAIAEAKABIABAAIALACg");
	this.shape_3.setTransform(344.35,200.9711);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#8B9B61").s().p("AgkBjQgKgCgIgDQgMgFgHgHIAAgBQAKAHAKAEQAJAFAJACIgBAAIAAAAgAA7A5QAJgSADgLQABgIAAgQQAAgPgEgPIgDgIIACAEQAOAlgOAmQgCAGgEAHIgFAHIADgIgAgRhgQgLAAgKACIgBAAQAKgEALAAQAIAAANAEQATAHAOAMQgYgTgdgCg");
	this.shape_4.setTransform(301.0564,195.4012);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#D0A56C").s().p("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");
	this.shape_5.setTransform(344.7625,247.3145);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#000000").s().p("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");
	this.shape_6.setTransform(344.6244,250.5904);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(149,54.1,391.29999999999995,393.09999999999997);


(lib.whisk_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#CA854C").s().p("AhnEXIAAgCIAFgYIADgNIADgLIADgEIAVACQANADAJAEIAGACIABABIAAABIgPAsIgCAFIgBABgAhODXIAAgCIAEgUQAvjpBWjZQAIgUAHgFQAGgEAHgBQAIAAAFAFQAHAGgDATQgHApgcBVQhGDWgvB5IgBAJIgBAEIgBACIgBACg");
	this.shape.setTransform(151.9974,35.3977);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AiNIVQgvgSgUg6QgGgSAAgNQAAgKADgSQAMhGAZgyQAJgSAQgaQA6hiBKhaIADgCQgBgBAAgBQAAAAAAgBQAAAAAAgBQABAAAAgBIAAgCIAKgqQACgJACgGIAAAAIABgEQACgCAEAAIAGAAIAAgEQAGgwAUhQQArisA/iiQALgeANgKQAKgHAMAAQAOABAGAJQAHALgEAUQgLA8gkBpIgaBOQgmBwgVA4IgVA6IAAABIgBADIgCAHIgBACIAJAEIAAABQADAAACADIgBAHIgJAbQgCAJgIASIAAAAIAAACIgBACIgBAAQABADAAADQgFA6ACAXIAEAfIABAjQACBogIA0IgIAqQgKAvgNAZQgTAnghANQgPAGgUABIgVABQgdAAgTgHgAAfCdIgBA2QgBAwgJBeIgDAaQgEAWgOApQgGAXgHAIQgKAMgWAEQgEAOgGAHQgJAMgTAHIANgBQAYgCAMgGQAMgGAKgKQAcggAOhFQAShfgFhiIgFhLIAAgZQgFAdgBASgAigHRQgCAVAGAOQAIAUASAEQAKADAQgEQAXgEALgJQAHgGAGgOQghAAgugSIgXgMIgBAFgAiNDxQgQAagLAWQgVAvgLA+QgDAOAAAOQAAAMAGAQQAIAZARATIAHAHIgDgIQgFgTAEgZQgMgLgCgOQgBgHAEgUQALgpAbhSQAPgpAHgOIAWgjQAQgaAYgpIAKgTQgzBDgqBIgAgGA5QggA7gzBzQgOAfgHASQgFAMgOAxIgRA7IgMAwIAHAEQAsAbA2gBIACgHQAUhRAKguQAPhHAGg6IAHhFIAIgjIANg0IACgEIgGgCIgOgCIgJgCIgGgBQAEADgFAGgAAYB5QgJAjgCAXIgDAaQgFA9gPBLQgIAqgYBcIAAACQAIgBAEgDQAKgFAIgXIALgmQAIgdABgIQACgOABgSIAJh3QgBgkABgSIAGg4IgCAMgAhXC9QgWAigGAOQgGAMgHAVQgSA1gXBOQgGAUAEAKQABAFAEAEIAIgiIAWhNQAGgZAGgSIATguIAohWIgWAjgAAHgLIgDALIgDAMIgEAYIAAACIAtAJIABgBIACgFIAPgrIAAgBIgBgBIgGgCQgJgEgNgDIgVgCgAC7oQQgHABgGAEQgHAFgIAUQhXDZgvDqIgEAUIAAACIAaAGIABgCIABgCIABgEIABgJQAvh5BHjXQAchVAHgpQADgTgHgGQgEgFgIAAIgBAAg");
	this.shape_1.setTransform(141.9942,59.4938);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(120.5,5.5,43,108);


(lib.frontbowl_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFF0").s().p("AiJAPQi8gGiigZIPPAAQgoAKgvAGQgtAFhTAEQigAIiDAAQg+AAg5gCg");
	this.shape.setTransform(77.975,7.714);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#999999").s().p("AhuE3QgugCghgIQgqgKgdgWQgHgEgEgGQAfAHAlAFQBBAIBeADQCVAFBrgKIA3gGIgCABQgOATgoAIQgpAIg0ADQghACg8ABIgvAAQg4AAgggCgAi/j4QiSgHh3gRQhigNg9gZIgFgCIBdAAIAlAHQCvAeDNAGQCmAFDXgKQBhgFAxgFQBPgKAxgSIBMAAQgFAEgHADQgWALgeAHQgSAEglAFQh7ASgfADQhXALhEADQgdABhaAAQihgBhogFg");
	this.shape_1.setTransform(76.325,37.3143);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AhbE9Qg4gBgjgIQgygJgigYQgPgKgFgKIgBgEIgbgJQgbgIgqgTQglgRgQgMQgdgUgXgjQgSgbgTgqQgag5gdhQQgRgvgGgcIgKhBQgDgSgKglQgGgbgDgRIgDgDIAQAAIAFACQA9AZBiANQB3AQCSAIQBoAEChACQBaAAAdgCQBEgCBXgLQAfgEB7gRQAlgFASgFQAegGAWgLQAHgDAFgEIAUAAQgIAXgEAhIgJA/QgGAqgPAyQgJAcgWA/QgPAqgKAZQgQAlgRAbQgbArgpAhQgpAhgwATQgfAMgrAHQABAEgEAEQgUAcg4AIQgqAIg0ACQgjABg8AAIhkgBgAkGEIQAdAVAqALQAhAIAuACQAtACBagBQA8AAAhgCQA0gDApgIQAogIAOgTIACgBIg3AGQhrAJiVgEQhegEhBgHQglgFgfgHQAEAGAHAEgApfjpQANBNAFAVQAIAeARAuQAYBAAfBCQAdA9AcAcQAdAcA6AYQAzAVAuALQBGARCEAEQCGAEBOgDQBkgEBDgTQBcgZA2g4QApgqAehHQAGgOAnhyQAXg/AGgdQADgLAIhGQADghAHgYIgOAJQgYALgfAIQgVAFgmAFIiaAVQhWALhFACQg0AChOgCQiggChWgEQiJgFhtgPQhzgPhEgaIgGgCQAJAeAHArgAhwkSQjNgGivgfIglgGIA4AAQCiAaC9AGQCtAFDsgLQBTgFAugFQAvgGAogKIAoAAQgxAShPAKQgxAFhhAFQiPAHh6AAQg8AAg4gCg");
	this.shape_2.setTransform(76.525,37.85);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#CC6699").s().p("AhDEeQiEgEhGgRQgugLgygVQg7gYgdgcQgcgbgcg+QgfhCgYg/QgSgvgIgeQgEgUgOhNQgHgrgJgeIAGACQBEAZBzAPQBuAPCIAGQBWADCgACQBPACAzgCQBGgCBWgKICagWQAlgFAVgFQAggHAXgMIAPgJQgHAYgEAhQgIBGgCAMQgHAcgXA/QgnBygGAOQgeBIgpApQg2A4hcAaQhCAShlAEQgkACgxAAQg3AAhIgDg");
	this.shape_3.setTransform(76.6,35.7067);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(12.6,6,127.9,63.7);


(lib.bowl_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// bowl
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#CC6699").s().p("AhDEfQiEgEhGgRQgugLgygVQg7gYgdgcQgcgcgcg9QgghCgXhAQgSgvgHgeQgFgUgNhNQgIgrgJgeIAGACQBEAaBzAPQBuAOCIAGQBWAECgACQBOACA0gCQBFgDBXgKICagVQAlgGAVgEQAggIAXgMQAJgEAGgFQgHAYgEAiQgIBFgCAMQgHAdgXA/QgnBygGAOQgeBHgpAqQg2A4hcAZQhCAThlADQgkACgxAAQg4AAhHgCg");
	this.shape.setTransform(193.5,101.6942);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#999999").s().p("AhvFmQgugCghgIQgqgLgdgVQgHgFgEgGQAfAHAlAFQBBAIBeAEQCVAEBrgJQAdgDAagEIgCACQgOATgoAIQgpAIg0ADQghACg8AAIgvAAQg4AAgggBgAjAjKQiSgHh3gQQhigOg9gYIgFgDIgGgFIgCgFIgBgBQAAgIAJgKQALgKARgHQAOgFAdgDQC6gVBegIQBIgGAzgCQA8gCBTABQB2ABA7ACQBkAEBPAJQAtAFB3ASIBXAOQAWADAEALQAEAJgHAKIgGAGQgFAEgHAEQgWAKgeAHQgSAEglAGQh7ARgfAEQhXALhEACQgdAChaAAQihgChogFgAjClMQhHAIgWABIgDAAQiDAEh9AQQgNACgEAGQgDAEACAGQABAFAEADQAFAFANADIANADIAlAHQCvAeDNAHQCmAFDXgKQBhgFAxgGQBPgKAxgSIADgBQAIgEABgEQADgJgRgFQhvgfibgJIkQgGIg6gBIgXABIgLAAIgKABIhKAAg");
	this.shape_1.setTransform(193.3183,98.6976);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFF0").s().p("AhzAuQi8gGijgbIg4gKQgUgDgFgKQBngOCIgHQATgDAfgCIAdgCIAIAAIAegDQAZgCArgBIBCgCIABAAIADAAIAEAAIAAAAQBkAEDJACQCwAHB4AjQgSAGgUAFQgoALgvAGQgtAFhTAFQigAHiEAAQg9AAg5gBg");
	this.shape_2.setTransform(192.675,70.689);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#000000").s().p("AhbFxQg4gCgjgHQgygKgigYQgPgKgFgKIgBgEIgbgIQgbgJgqgTQglgRgQgMQgdgUgXgjQgSgbgTgqQgag5gdhQQgRgugGgcIgKhCQgDgSgKglIgKgsIgCgDQgFgJAEgMQAEgKAJgIQAVgTAmgHQAOgCA1gDQAdgCApgFIBGgKQBegMB2gDQBHgBCNACQBiABAxACQBSAEBBAHIBzARQBJAMApAFQAZADAJAEQATAKAAAQIAAADIACAEQABACgCAGIgCAFQgIAXgEAiIgJA+QgGAqgPAzQgJAcgWA9QgPAsgKAYQgQAlgRAbQgbAsgpAhQgpAhgwASQgfAMgrAHQABADgEAFQgUAcg4AJQgqAHg0ACQgjACg8AAIhkgBgAkGE7QAdAWAqAKQAhAIAuACQAtADBagBQA8gBAhgCQA0gDApgIQAogIAOgTIACgCQgaAEgdADQhrAKiVgFQhegDhBgIQgmgFgfgHQAFAFAHAFgApfi1QANBNAFAUQAIAeARAvQAYA/AfBCQAdA+AcAbQAdAcA6AYQAzAVAuALQBGARCEAEQCGAEBOgDQBkgEBDgSQBcgaA2g4QApgpAehIQAGgOAnhyQAXg/AGgcQADgMAIhGQADghAHgYQgGAEgIAFQgYAMgfAHQgVAFgmAFIiaAWQhWAKhFACQg0AChOgCQiggChWgDQiJgGhtgPQhzgPhEgZIgGgDQAJAfAHArgAiUllQgzAChIAGQheAIi6AVQgdADgOAFQgRAHgLAKQgJAJAAAIIABABIACAGIAGAFIAFACQA9AZBiANQB3ARCSAHQBoAFChABQBaAAAdgBQBEgDBXgLQAfgDB7gSQAlgFASgEQAegHAWgLQAHgDAEgEIAHgHQAHgJgEgJQgEgLgWgDIhXgOQh3gTgtgFQhPgJhkgDQg7gCh2gBIg1gBIhaACgAhwjfQjNgGivgeIglgHIgNgDQgNgDgFgFQgEgEgBgFQgCgFADgFQAEgFANgCQB9gQCDgFIADAAQAWAABHgIIAWgDIBKAAIAKgBIALAAIAXgBIA6ABIEQAHQCbAIBvAgQARAEgDAKQgBADgIAFIgDABQgyAShOAKQgxAFhhAFQiPAHh6AAQg9AAg3gCgAhAlHIAAABIhCACQgrAAgaACIgdADIgIABIgdACQggABgSAEQiJAGhnAPQAFAKAVAEIA4AKQCiAaC9AGQCtAGDsgMQBTgEAugGQAvgGAogKQAUgGASgGQh5gkivgHQjKgChjgEIAAABIgFgBg");
	this.shape_3.setTransform(193.4411,98.7429);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(129.2,61.8,128.5,73.89999999999999);


(lib.milk3_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#81B8C7").s().p("AAeB/IAAh/IgeAxIgdgxIAAB/IhPAAIAAj9IBMAAIAgA1IAgg1IBNAAIAAD9g");
	this.shape.setTransform(338.9,221.925);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#81B8C7").s().p("AgnB/IAAj9IBPAAIAAD9g");
	this.shape_1.setTransform(319.5,221.925);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#81B8C7").s().p("AASB/IAAgDQAAgqgLgXQgKgYgUgBIAABdIhPAAIAAj9IBPAAIAABVQAQAAAMgUQANgTAAgqIAAgEIBQAAIAAAEQAABVgjAlQAoAtAABPIAAADg");
	this.shape_2.setTransform(302,221.925);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#81B8C7").s().p("AhTBwIAUhVQAIASANAMQAMALALAAQAGAAAEgEQADgEAAgHQAAgGgCgEQgDgEgFgEIgUgLQgVgNgJgPQgKgQAAgYQAAhWBWAAQAmAAAhARIgUBQQgJgSgMgKQgLgJgMAAQgHAAgDADQgEAEAAAFQAAAIAFAFQAFAEASALQATAKALAJQALAKAFANQAHAOgBATQABBWhWAAQgsAAglgTg");
	this.shape_3.setTransform(280.1,221.925);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FFFFF0").s().p("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");
	this.shape_4.setTransform(347.2841,241.48);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#81B8C7").s().p("ABBGQIg4gCIglgEIgmgFIgngIIgegHIgegJIgegJIgegLQgogOglgYQgagPgQgcQgJgRgGgSQgFgSgCgVQgCgOABgNQAAgOABgNQACgOAEgNQAEgPAGgNQAGgNAHgNQAIgMAKgLQAKgMALgLIAagWIANgKQgEgjACgkQgegYgcgdQgWgWgRgbIgGgOQgCgIAAgHQAAgNABgNIACgKIAEgKIAFgJIAGgIIAHgHIAIgHQAEgEAFgBQANgEAOAAQASAAATADQAeAIAaARQADgtASgrQANgRARAIQAJAFAIAHQgIAhgGAjIgDATQAygTA1gJQAmgHAmgBIANAAIANABIAaAFIANADIAMAEIAMAFIAUALIAUAKQAFgigPgfQgGgKgHgKQgGgHADgLQACgEADgDQAEgFAGgDIAGgDIAIAAQAeAVAMAkQAHAVgBAVQATgPAagGQAqgJAjAXQAIAEAIAHIAGAHIAJAOIAEAJIACAJIAAAKIABANIgBAMIgCALIgDALIgLAVQgGAKgIAKIgiArIgVAfIgKAQIgHARQgGAQgEARQgCAHAAAIQAeAPAZAYQATATANAVIAGALIAGAMIAJAZIADAMIACAOIACANIABAOIABAOIAAAOIgCANIgEAZQgEASgJASQgIARgMAPIgXAcIgMAMQgMAKgNAJQgPALgUAGQgmAOgpAAIgeAAIg8AAgAAAj/IgkAEIgXADIgWAGQgKAFgKAGQgQAIgPALQgQAMgLAOIgNASIgKATIgIAVIgFAVIgEAYIgBAXIABAXQABAPAAAPQAAAGgEAEQgJALgLAKIgRAPIgQAQIgYAZQgMAOgGAQQgHAQgCARQgCARADASQACARAGAPQAGAQAKANQAIALALAJQAJAHAKAGQAKAFALAFIAVAKIAVAHIAYAHIAXAFIAYAGIAXAEIAXAGIAWAEIAXADIAWADIAXABIAWABIAXAAIAWAAIAWgBIAVgBIAVgBIAggBQAPgBAPgHIASgKIASgMQAQgNAKgOQAKgQAFgSQAEgMACgMIACgVIAAgWQgBgKgCgKIgHgfQgFgQgJgNQgKgMgNgJIgVgQQgNgKgKgMQgKgKgIgMQgJgPACgUIAAglIgCgmIgEgXIgGgYQgEgLgGgLQgIgQgKgPQgJgNgOgNQgNgLgQgIIgggOIgVgEIgWgBIgWADgAD8kAQgQAHgLANIgPAVIANAbIAGAOIAFAOIAFARIAcgfIAOgPIAMgQQAHgKAFgLQAEgIgDgJQgCgIgIgGIgKgGQgSABgQAGgAkyjeQAEANALAJQASARATAOIAKAIIAXgqIgFgJQgJgSgRgLQgNgIgQgDIgVgCQgJARAFAPgACYEMQgLgEgKgFQgQgJgLgOQgLgNgFgQQgGgTABgSQABgSAGgQQAGgQAOgKQAJgHAKgGQAMgGANACIAXAAIAWADQASAIAOAOQAOANAGAQQAHATABASQAAAMgBAMQgCASgKANQgLAPgRAJQgQAIgTACIgCAAQgOAAgPgFgACXCYQgFALgBALQgBAMAEANQAJAHAMACQAIACAHgBQAGgCADgGQAHgOgEgMQgEgLgKgGQgJgGgNgBIgJABgAiqD4QgvgKgZgoQgfgwAjgrQASgWAZgJQA0gMAmAhQAiAdgCAtQgCA2gwATQgPAGgPAAQgIAAgJgCgAi5CIIgKAIQADArAtABIADAAIAHgEQARgjgkgLQgKgCgLAAIgIAAgABSgkQgSgHgGgUIgGgUIgBgKQABgPAEgOQAEgMAKgIQAIgHAKAFQANAGAGANQAHARABARQABAUgHATQgEALgKAFIgHABIgGgBgAhYgmQgLgCgFgJQgLgRgDgTIgBgKQACgQADgNQAEgMAKgIQAJgGAJAEQAMAGAHANQAIARAAARQAAAUgGATQgGARgQAAIgFgBg");
	this.shape_5.setTransform(306.2688,289.1833);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#000000").s().p("AkkfGIhVgOIgygKQiJgYiNggQg1gLgsgdQgPgKgLgOIgLgPQgHgJgEgLQhFi6gzjBQhZlPghlaQgQitgCiwIgEjZQgBg/gEg+QgTl0A0lxQASh/Ash2QAJgYAQgUQAmgsApgpQC9i+C1jCQAjgkAkgkQANgNARgHIAIgVIgWgtIgVguIgqhjQgUgygSgyQgEgKAAgLQAAgKADgJQAHgQAOgHIAxgYIDbgcIIOgsIA3gCIA3AAIB9ACIB8ACIB8ACIB7ABQAbAAANAWQAJAOAAAOQABBcgVBaQgRBLgiBGQgQAjgVAiIACAZIACAZQADARAEAQQAEARAGAPQAGAQAIAOQAIAOAKANQA+BPAwBYQBBB6AUCIQAEAZAFAYIAEAXIAMBVQAQBtAEBvIACA7IAaKeIACAtIABAWIACA7IABBFIABA6IAABMQgDCKgLCMQgRDLgbDJIggDjIgQByQgSB6gfBzQgDALgBANQgBAQgMALQgWAUgeAKQhbAehcAYQhRAWhQAUQgZAHgdAEQhEAKhHAIIg2AGIgNACQgPABgOACQgLABgNADIgfAFIgcAEIghAFIhWANIgwAGIhAAGIgmACIgjAAQhXAAhWgOgACsucIh0AFQhWAEhYAAQjqACjsAOQilAOijApQgbAHgaASQgRBXgHBXQgGBOgIBOQgKBigGBkQgTEoAREpQANDRARDRIALCJQAMCdAdCbQAkC3A6C0QArCEAzCAQAKACAKAEIAPAIQAZALAaAGQCWAlCZAYQA4AKA7AIQBDAJBCABQBGABBEgJQBCgJBDgLQA2gIA0gNQANgDAMgIQAIgFABgJQADgegCgfIgBghQgGhJAChKQAEh+gCh/QgBgwADgwIAAiRQABkFAHoJIACjYQACipADheQAFiSAKh1IACgXIAAgQQAAgdACgcIACgXQAHhMAFhMIADhgQAAgJACgJQAHgdgCgcIgFhFQhWAGhYACgALju8IiRAKIh8AHQgsEVgYEYQgHBOgDA2QgDBCgCCGIgMNZQgEFeAACvQAAEaAKDjIACACIACADQADADAEAAIAEABQAZACAZgGIAigFQBWgPBUgXQAtgNAtgPQApgMAlgNQAjgLAigNIAEghIAJgvQAMg6AKg5QAqkEAfkGQAWi4ALi8QAHh9ABh8QABhQgDhRQgDhIgEhGIgYo0IgDhUIgDgvIgEg4QgHhhgXhfQgFgUgLgSQgWgigogNQgVgHgWgFQgegCgdAAIgsABgAn808QgpAqgqAqQgrApgsAoIhbBVQgvAtguAtIguAuQCAgNB+gMICpgQICqgPICSgMIB8gGIB7gDIA+AAIA/ABIA+ABIBfAEQBAhZA6hcQAmg/Ajg/QAjhAAhhBIAghCIivAFIh1AEIh2AFIh1AHIh0AJIh0AJIg6AFIg6AFIg7AFIgnACIgnAAIgggCQg5BEg+BBgAJdzJQg9BohHBiQBzgMBzgKIDmgOIg6hmQgvg1gkg+Qgkg+gahCIgOgkQgzBug8BpgAEF91Io4AvIiiAbIB7EOIBggJIBfgOIAYgEIAsgCIBEgBICGgDICHgDICGgDICKgFICNgMIBGgJIAOgfIANggIANggIALggIALgjQAKgkAHgjIAIgtIl9gFg");
	this.shape_6.setTransform(347.1716,241.5667);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(226.7,41.1,233,400.9);


(lib.milk2_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#81B8C7").s().p("Ag6CDIBbkFIAbAAIhcEFgAAcBtQgPgTAAgdQAAgdAQgUQAQgSAZAAQAUAAAQATQAQAUABAbQAAAfgQASQgQATgYAAQgXAAgQgTgAA8AvQgDAEAAAGQAAAGADAEQADAEAFAAQAEAAAEgEQADgDAAgGQAAgGgDgEQgEgFgDAAQgFAAgEAEgAhqgNQgPgUAAgdQAAgdAPgTQARgUAZAAQAUAAAQAUQAQAUABAbQAAAfgQATQgQASgYAAQgXAAgQgSgAhKhLQgEAEAAAGQABAGADAEQADAEAEAAQAFAAAEgEQADgEAAgGQAAgGgDgEQgDgEgFAAQgFAAgDAEg");
	this.shape.setTransform(322.35,221.925);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#81B8C7").s().p("AgmCBIAAjgIBOghIAAEBg");
	this.shape_1.setTransform(298.15,221.725);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFF0").s().p("Ah3d5QhCgBhDgJQg7gIg4gKQiZgYiWglQgagGgZgLIgPgIQgKgEgKgCQgziAgriEQg6i0gki3QgdibgMidIgLiJQgRjRgNjRQgRkpATkoQAGhkAKhiQAIhOAGhOQAHhXARhXQAagSAbgHQCjgpClgOQDsgODqgCQBYAABWgEIB0gFQBYgCBWgGIAFBFQACAcgHAdQgCAJAAAJIgDBgQgFBMgHBMIgCAXQgCAcAAAdIAAAPIgCAYQgKB1gFCSQgDBegCCpIgCDYQgHIJgBEFIAACRQgDAwABAwQACB/gEB+QgCBKAGBJIABAhQACAfgDAeQgBAJgIAFQgMAIgNADQg0ANg2AIQhDALhCAJQg9AIg/AAIgOAAgAreCpQgFABgEAEIgIAHIgHAHIgGAIIgFAJIgEAKIgCAKQgBANAAANQAAAHACAIIAGAOQARAbAWAWQAcAdAeAYQgCAkAEAjIgNAKIgaAXQgLALgKAMQgKALgIAMQgHANgGANQgGANgEAPQgEANgCAOQgBANAAAOQgBANACAOQACAVAFASQAGASAJARQAQAcAaAPQAlAYAoAOIAeALIAeAJIAeAJIAeAHIAnAIIAmAFIAmAEIA4ACQAtABAtgBQApAAAmgOQAUgGAPgLQANgJAMgKIAMgMIAXgcQAMgPAIgRQAJgSAEgSIAEgZIACgNIAAgOIgBgOIgBgOIgCgNIgCgOIgDgMIgJgZIgGgMIgGgLQgNgVgTgTQgZgYgegQQAAgIACgHQAEgRAGgQIAHgRIAKgQIAVgfIAigrQAIgKAGgKIALgVIADgLIACgLIABgMIgBgNIAAgKIgCgJIgEgJIgJgOIgGgHQgIgHgIgEQgjgXgqAJQgaAGgTAPQABgVgHgVQgMgkgegVIgIAAIgGADQgGADgEAFQgDADgCAEQgDALAGAHQAHAKAGAKQAPAfgFAiIgUgKIgUgLIgMgFIgMgEIgNgDIgagFIgNgBIgNAAQgnABgmAHQg1AJgyATIADgTQAGgjAIghQgIgHgJgFQgRgIgNARQgSArgDAtQgagRgegIQgTgDgSAAQgOAAgNAEgAGLc7IgEgBQgEAAgDgDIgCgDIgDgCQgJjkAAkZQAAivAEleIAMtZQACiGADhCQADg2AHhOQAYkYAskVIB8gHICRgKQAzgDA0AEQAWAFAVAHQAoANAWAiQALASAFAUQAXBfAHBhIAEA4IADAvIADBUIAYI0QAEBGADBIQADBRgBBQQgBB8gHB9QgLC8gWC4QgfEGgqEEQgKA5gMA6IgJAvIgEAhQgiANgjALQglANgpAMQgtAPgtANQhUAXhWAPIgiAFQgTAFgTAAIgMgBgAlRMwIgXAAIgWgBIgXgBIgXgDIgXgDIgWgEIgXgGIgXgEIgYgGIgXgFIgYgHIgVgHIgVgKQgLgFgKgFQgKgGgJgHQgLgJgIgLQgKgNgGgQQgGgPgCgRQgDgSACgRQACgRAHgQQAGgQAMgOIAYgZIAQgQIARgPQALgKAJgLQAEgFAAgGQAAgPgBgPIgBgXIABgXIAEgYIAFgVIAIgVIAKgTIANgSQALgOAQgMQAPgLAQgIQAKgGAKgFIAWgGIAXgDIAlgEIAWgDIAWABIAVAEIAgAOQAQAIANALQAOANAJANQAKAPAIAQQAGALAEALIAGAYIAEAXIACAmIAAAlQgCAVAJAPQAIAMAKAKQAKAMANAKIAVAQQANAJAKAMQAJANAFAQIAHAfQACAKABAKIAAAWIgCAVQgCAMgEAMQgFASgKAQQgKAOgQANIgSAMIgSAKQgPAHgPABIggABIgVABIgVABIgWABIgWAAgAkYI+QgKAGgJAHQgOAKgGAQQgGAQgBASQgBASAGATQAFAQALANQALAOAQAJQAKAFALAEQAQAGAPgBQATgCAQgIQARgJALgPQAKgNACgSQABgMAAgMQgBgSgHgTQgGgQgOgNQgOgOgSgIIgWgDIgXAAIgHAAQgJAAgJAEgApdIpQgZAJgSAWQgjArAfAwQAZAoAvAKQAYAFAXgJQAwgTACg2QACgtgigdQgcgZgkAAQgMAAgOAEgAlTFOQgKAIgEAMQgEAOgBAPIABAKIAGAUQAGAUASAHQAHACAGgCQAKgFAEgLQAHgTgBgUQgBgRgHgRQgGgNgNgGQgEgCgEAAQgFAAgFAEgAn+FMQgKAIgEAMQgDANgCAQIABAKQADATALARQAFAJALACQAUAEAHgUQAGgTAAgUQAAgRgIgRQgHgNgMgGIgHgCQgGAAgFAEgAjwKtQgMgCgJgHQgEgNABgMQABgLAFgLIAJgBQANABAJAGQAKAGAEALQAEAMgHAOQgDAGgGACIgFAAIgKgBgAotKZQgtgBgDgrIAKgIQAPgBAOADQAkALgRAjIgHAEIgDAAgAivE8IgFgOIgGgOIgNgbIAPgVQALgNAQgHQAQgGASgBIAKAGQAIAGACAIQADAJgEAIQgFALgHAKIgMAQIgOAPIgcAfgAqYEzQgTgOgSgRQgLgJgEgNQgFgPAJgRIAVACQAQADANAIQARALAJASIAFAJIgXAqIgKgIgAtfvnQAugtAvgtIBbhVQAsgoArgpQAqgqApgqQA+hBA5hEIAgACIAnAAIAngCIA7gFIA6gFIA6gFIB0gJIB0gJIB1gHIB2gFIB1gEICvgFIggBCQghBBgjBAQgjA/gmA/Qg6BchABZIhfgEIg+gBIg/gBIg+AAIh7ADIh8AGIiSAMIiqAPIipAQQh+AMiAANIAugugAJczIQA8hpAzhuIAOAkQAaBCAkA+QAkA+AvA1IA6BmIjmAOQhzAKhzAMQBHhiA9hogAnW8qICigbII4gvICygEIF9AFIgIAtQgHAjgKAkIgLAjIgLAgIgNAgIgNAgIgOAfIhGAJIiNAMIiKAFIiGADIiHADIiGADIhEABIgsACIgYAEIhfAOIhgAJg");
	this.shape_2.setTransform(347.2841,241.48);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#81B8C7").s().p("ABBGQIg4gCIglgEIgmgFIgngIIgegHIgegJIgegJIgegLQgogOglgYQgagPgQgcQgJgRgGgSQgFgSgCgVQgCgOABgNQAAgOABgNQACgOAEgNQAEgPAGgNQAGgNAHgNQAIgMAKgLQAKgMALgLIAagWIANgKQgEgjACgkQgegYgcgdQgWgWgRgbIgGgOQgCgIAAgHQAAgNABgNIACgKIAEgKIAFgJIAGgIIAHgHIAIgHQAEgEAFgBQANgEAOAAQASAAATADQAeAIAaARQADgtASgrQANgRARAIQAJAFAIAHQgIAhgGAjIgDATQAygTA1gJQAmgHAmgBIANAAIANABIAaAFIANADIAMAEIAMAFIAUALIAUAKQAFgigPgfQgGgKgHgKQgGgHADgLQACgEADgDQAEgFAGgDIAGgDIAIAAQAeAVAMAkQAHAVgBAVQATgPAagGQAqgJAjAXQAIAEAIAHIAGAHIAJAOIAEAJIACAJIAAAKIABANIgBAMIgCALIgDALIgLAVQgGAKgIAKIgiArIgVAfIgKAQIgHARQgGAQgEARQgCAHAAAIQAeAPAZAYQATATANAVIAGALIAGAMIAJAZIADAMIACAOIACANIABAOIABAOIAAAOIgCANIgEAZQgEASgJASQgIARgMAPIgXAcIgMAMQgMAKgNAJQgPALgUAGQgmAOgpAAIgeAAIg8AAgAAAj/IgkAEIgXADIgWAGQgKAFgKAGQgQAIgPALQgQAMgLAOIgNASIgKATIgIAVIgFAVIgEAYIgBAXIABAXQABAPAAAPQAAAGgEAEQgJALgLAKIgRAPIgQAQIgYAZQgMAOgGAQQgHAQgCARQgCARADASQACARAGAPQAGAQAKANQAIALALAJQAJAHAKAGQAKAFALAFIAVAKIAVAHIAYAHIAXAFIAYAGIAXAEIAXAGIAWAEIAXADIAWADIAXABIAWABIAXAAIAWAAIAWgBIAVgBIAVgBIAggBQAPgBAPgHIASgKIASgMQAQgNAKgOQAKgQAFgSQAEgMACgMIACgVIAAgWQgBgKgCgKIgHgfQgFgQgJgNQgKgMgNgJIgVgQQgNgKgKgMQgKgKgIgMQgJgPACgUIAAglIgCgmIgEgXIgGgYQgEgLgGgLQgIgQgKgPQgJgNgOgNQgNgLgQgIIgggOIgVgEIgWgBIgWADgAD8kAQgQAHgLANIgPAVIANAbIAGAOIAFAOIAFARIAcgfIAOgPIAMgQQAHgKAFgLQAEgIgDgJQgCgIgIgGIgKgGQgSABgQAGgAkyjeQAEANALAJQASARATAOIAKAIIAXgqIgFgJQgJgSgRgLQgNgIgQgDIgVgCQgJARAFAPgACYEMQgLgEgKgFQgQgJgLgOQgLgNgFgQQgGgTABgSQABgSAGgQQAGgQAOgKQAJgHAKgGQAMgGANACIAXAAIAWADQASAIAOAOQAOANAGAQQAHATABASQAAAMgBAMQgCASgKANQgLAPgRAJQgQAIgTACIgCAAQgOAAgPgFgACXCYQgFALgBALQgBAMAEANQAJAHAMACQAIACAHgBQAGgCADgGQAHgOgEgMQgEgLgKgGQgJgGgNgBIgJABgAiqD4QgvgKgZgoQgfgwAjgrQASgWAZgJQA0gMAmAhQAiAdgCAtQgCA2gwATQgPAGgPAAQgIAAgJgCgAi5CIIgKAIQADArAtABIADAAIAHgEQARgjgkgLQgKgCgLAAIgIAAgABSgkQgSgHgGgUIgGgUIgBgKQABgPAEgOQAEgMAKgIQAIgHAKAFQANAGAGANQAHARABARQABAUgHATQgEALgKAFIgHABIgGgBgAhYgmQgLgCgFgJQgLgRgDgTIgBgKQACgQADgNQAEgMAKgIQAJgGAJAEQAMAGAHANQAIARAAARQAAAUgGATQgGARgQAAIgFgBg");
	this.shape_3.setTransform(306.2688,289.1833);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#000000").s().p("AkkfGIhVgOIgygKQiJgYiNggQg1gLgsgdQgPgKgLgOIgLgPQgHgJgEgLQhFi6gzjBQhZlPghlaQgQitgCiwIgEjZQgBg/gEg+QgTl0A0lxQASh/Ash2QAJgYAQgUQAmgsApgpQC9i+C1jCQAjgkAkgkQANgNARgHIAIgVIgWgtIgVguIgqhjQgUgygSgyQgEgKAAgLQAAgKADgJQAHgQAOgHIAxgYIDbgcIIOgsIA3gCIA3AAIB9ACIB8ACIB8ACIB7ABQAbAAANAWQAJAOAAAOQABBcgVBaQgRBLgiBGQgQAjgVAiIACAZIACAZQADARAEAQQAEARAGAPQAGAQAIAOQAIAOAKANQA+BPAwBYQBBB6AUCIQAEAZAFAYIAEAXIAMBVQAQBtAEBvIACA7IAaKeIACAtIABAWIACA7IABBFIABA6IAABMQgDCKgLCMQgRDLgbDJIggDjIgQByQgSB6gfBzQgDALgBANQgBAQgMALQgWAUgeAKQhbAehcAYQhRAWhQAUQgZAHgdAEQhEAKhHAIIg2AGIgNACQgPABgOACQgLABgNADIgfAFIgcAEIghAFIhWANIgwAGIhAAGIgmACIgjAAQhXAAhWgOgACsucIh0AFQhWAEhYAAQjqACjsAOQilAOijApQgbAHgaASQgRBXgHBXQgGBOgIBOQgKBigGBkQgTEoAREpQANDRARDRIALCJQAMCdAdCbQAkC3A6C0QArCEAzCAQAKACAKAEIAPAIQAZALAaAGQCWAlCZAYQA4AKA7AIQBDAJBCABQBGABBEgJQBCgJBDgLQA2gIA0gNQANgDAMgIQAIgFABgJQADgegCgfIgBghQgGhJAChKQAEh+gCh/QgBgwADgwIAAiRQABkFAHoJIACjYQACipADheQAFiSAKh1IACgXIAAgQQAAgdACgcIACgXQAHhMAFhMIADhgQAAgJACgJQAHgdgCgcIgFhFQhWAGhYACgALju8IiRAKIh8AHQgsEVgYEYQgHBOgDA2QgDBCgCCGIgMNZQgEFeAACvQAAEaAKDjIACACIACADQADADAEAAIAEABQAZACAZgGIAigFQBWgPBUgXQAtgNAtgPQApgMAlgNQAjgLAigNIAEghIAJgvQAMg6AKg5QAqkEAfkGQAWi4ALi8QAHh9ABh8QABhQgDhRQgDhIgEhGIgYo0IgDhUIgDgvIgEg4QgHhhgXhfQgFgUgLgSQgWgigogNQgVgHgWgFQgegCgdAAIgsABgAn808QgpAqgqAqQgrApgsAoIhbBVQgvAtguAtIguAuQCAgNB+gMICpgQICqgPICSgMIB8gGIB7gDIA+AAIA/ABIA+ABIBfAEQBAhZA6hcQAmg/Ajg/QAjhAAhhBIAghCIivAFIh1AEIh2AFIh1AHIh0AJIh0AJIg6AFIg6AFIg7AFIgnACIgnAAIgggCQg5BEg+BBgAJdzJQg9BohHBiQBzgMBzgKIDmgOIg6hmQgvg1gkg+Qgkg+gahCIgOgkQgzBug8BpgAEF91Io4AvIiiAbIB7EOIBggJIBfgOIAYgEIAsgCIBEgBICGgDICHgDICGgDICKgFICNgMIBGgJIAOgfIANggIANggIALggIALgjQAKgkAHgjIAIgtIl9gFg");
	this.shape_4.setTransform(347.1716,241.5667);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(226.7,41.1,233,400.9);


(lib.milk_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#81B8C7").s().p("AhJB/IAAj9ICTAAIAABAIhFAAIAAAfIAxAAIAAA/IgxAAIAAAfIBFAAIAABAg");
	this.shape.setTransform(359.2,221.925);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#81B8C7").s().p("AhJB/IAAj9IBOAAIAAC9IBFAAIAABAg");
	this.shape_1.setTransform(341.425,221.925);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#81B8C7").s().p("Ag/BfQgbgkAAg/QAAggALgcQAMgdAVgTQAVgSAcAAQAjAAAbAmQAaAmAAA1QAAA6gaAlQgaAlgoAAQgjAAgbgkgAgMgZQgFAIAAALQAAALAFAHQAFAIAHAAQAIAAAFgIQAFgHAAgLQAAgLgFgIQgFgHgIAAQgHAAgFAHg");
	this.shape_2.setTransform(320.975,221.925);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#81B8C7").s().p("AAUB/IAAheIgnAAIAABeIhPAAIAAj9IBPAAIAABdIAnAAIAAhdIBPAAIAAD9g");
	this.shape_3.setTransform(297.975,221.925);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#81B8C7").s().p("AAdB/IgchlIgZBlIg7AAIg/j9IBOAAIATBTIAXhTIA1AAIAXBTIAUhTIBNAAIg8D9g");
	this.shape_4.setTransform(270.55,221.925);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FFFFF0").s().p("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");
	this.shape_5.setTransform(347.2841,241.48);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#81B8C7").s().p("ABBGQIg4gCIglgEIgmgFIgngIIgegHIgegJIgegJIgegLQgogOglgYQgagPgQgcQgJgRgGgSQgFgSgCgVQgCgOABgNQAAgOABgNQACgOAEgNQAEgPAGgNQAGgNAHgNQAIgMAKgLQAKgMALgLIAagWIANgKQgEgjACgkQgegYgcgdQgWgWgRgbIgGgOQgCgIAAgHQAAgNABgNIACgKIAEgKIAFgJIAGgIIAHgHIAIgHQAEgEAFgBQANgEAOAAQASAAATADQAeAIAaARQADgtASgrQANgRARAIQAJAFAIAHQgIAhgGAjIgDATQAygTA1gJQAmgHAmgBIANAAIANABIAaAFIANADIAMAEIAMAFIAUALIAUAKQAFgigPgfQgGgKgHgKQgGgHADgLQACgEADgDQAEgFAGgDIAGgDIAIAAQAeAVAMAkQAHAVgBAVQATgPAagGQAqgJAjAXQAIAEAIAHIAGAHIAJAOIAEAJIACAJIAAAKIABANIgBAMIgCALIgDALIgLAVQgGAKgIAKIgiArIgVAfIgKAQIgHARQgGAQgEARQgCAHAAAIQAeAPAZAYQATATANAVIAGALIAGAMIAJAZIADAMIACAOIACANIABAOIABAOIAAAOIgCANIgEAZQgEASgJASQgIARgMAPIgXAcIgMAMQgMAKgNAJQgPALgUAGQgmAOgpAAIgeAAIg8AAgAAAj/IgkAEIgXADIgWAGQgKAFgKAGQgQAIgPALQgQAMgLAOIgNASIgKATIgIAVIgFAVIgEAYIgBAXIABAXQABAPAAAPQAAAGgEAEQgJALgLAKIgRAPIgQAQIgYAZQgMAOgGAQQgHAQgCARQgCARADASQACARAGAPQAGAQAKANQAIALALAJQAJAHAKAGQAKAFALAFIAVAKIAVAHIAYAHIAXAFIAYAGIAXAEIAXAGIAWAEIAXADIAWADIAXABIAWABIAXAAIAWAAIAWgBIAVgBIAVgBIAggBQAPgBAPgHIASgKIASgMQAQgNAKgOQAKgQAFgSQAEgMACgMIACgVIAAgWQgBgKgCgKIgHgfQgFgQgJgNQgKgMgNgJIgVgQQgNgKgKgMQgKgKgIgMQgJgPACgUIAAglIgCgmIgEgXIgGgYQgEgLgGgLQgIgQgKgPQgJgNgOgNQgNgLgQgIIgggOIgVgEIgWgBIgWADgAD8kAQgQAHgLANIgPAVIANAbIAGAOIAFAOIAFARIAcgfIAOgPIAMgQQAHgKAFgLQAEgIgDgJQgCgIgIgGIgKgGQgSABgQAGgAkyjeQAEANALAJQASARATAOIAKAIIAXgqIgFgJQgJgSgRgLQgNgIgQgDIgVgCQgJARAFAPgACYEMQgLgEgKgFQgQgJgLgOQgLgNgFgQQgGgTABgSQABgSAGgQQAGgQAOgKQAJgHAKgGQAMgGANACIAXAAIAWADQASAIAOAOQAOANAGAQQAHATABASQAAAMgBAMQgCASgKANQgLAPgRAJQgQAIgTACIgCAAQgOAAgPgFgACXCYQgFALgBALQgBAMAEANQAJAHAMACQAIACAHgBQAGgCADgGQAHgOgEgMQgEgLgKgGQgJgGgNgBIgJABgAiqD4QgvgKgZgoQgfgwAjgrQASgWAZgJQA0gMAmAhQAiAdgCAtQgCA2gwATQgPAGgPAAQgIAAgJgCgAi5CIIgKAIQADArAtABIADAAIAHgEQARgjgkgLQgKgCgLAAIgIAAgABSgkQgSgHgGgUIgGgUIgBgKQABgPAEgOQAEgMAKgIQAIgHAKAFQANAGAGANQAHARABARQABAUgHATQgEALgKAFIgHABIgGgBgAhYgmQgLgCgFgJQgLgRgDgTIgBgKQACgQADgNQAEgMAKgIQAJgGAJAEQAMAGAHANQAIARAAARQAAAUgGATQgGARgQAAIgFgBg");
	this.shape_6.setTransform(306.2688,289.1833);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#000000").s().p("AkkfGIhVgOIgygKQiJgYiNggQg1gLgsgdQgPgKgLgOIgLgPQgHgJgEgLQhFi6gzjBQhZlPghlaQgQitgCiwIgEjZQgBg/gEg+QgTl0A0lxQASh/Ash2QAJgYAQgUQAmgsApgpQC9i+C1jCQAjgkAkgkQANgNARgHIAIgVIgWgtIgVguIgqhjQgUgygSgyQgEgKAAgLQAAgKADgJQAHgQAOgHIAxgYIDbgcIIOgsIA3gCIA3AAIB9ACIB8ACIB8ACIB7ABQAbAAANAWQAJAOAAAOQABBcgVBaQgRBLgiBGQgQAjgVAiIACAZIACAZQADARAEAQQAEARAGAPQAGAQAIAOQAIAOAKANQA+BPAwBYQBBB6AUCIQAEAZAFAYIAEAXIAMBVQAQBtAEBvIACA7IAaKeIACAtIABAWIACA7IABBFIABA6IAABMQgDCKgLCMQgRDLgbDJIggDjIgQByQgSB6gfBzQgDALgBANQgBAQgMALQgWAUgeAKQhbAehcAYQhRAWhQAUQgZAHgdAEQhEAKhHAIIg2AGIgNACQgPABgOACQgLABgNADIgfAFIgcAEIghAFIhWANIgwAGIhAAGIgmACIgjAAQhXAAhWgOgACsucIh0AFQhWAEhYAAQjqACjsAOQilAOijApQgbAHgaASQgRBXgHBXQgGBOgIBOQgKBigGBkQgTEoAREpQANDRARDRIALCJQAMCdAdCbQAkC3A6C0QArCEAzCAQAKACAKAEIAPAIQAZALAaAGQCWAlCZAYQA4AKA7AIQBDAJBCABQBGABBEgJQBCgJBDgLQA2gIA0gNQANgDAMgIQAIgFABgJQADgegCgfIgBghQgGhJAChKQAEh+gCh/QgBgwADgwIAAiRQABkFAHoJIACjYQACipADheQAFiSAKh1IACgXIAAgQQAAgdACgcIACgXQAHhMAFhMIADhgQAAgJACgJQAHgdgCgcIgFhFQhWAGhYACgALju8IiRAKIh8AHQgsEVgYEYQgHBOgDA2QgDBCgCCGIgMNZQgEFeAACvQAAEaAKDjIACACIACADQADADAEAAIAEABQAZACAZgGIAigFQBWgPBUgXQAtgNAtgPQApgMAlgNQAjgLAigNIAEghIAJgvQAMg6AKg5QAqkEAfkGQAWi4ALi8QAHh9ABh8QABhQgDhRQgDhIgEhGIgYo0IgDhUIgDgvIgEg4QgHhhgXhfQgFgUgLgSQgWgigogNQgVgHgWgFQgegCgdAAIgsABgAn808QgpAqgqAqQgrApgsAoIhbBVQgvAtguAtIguAuQCAgNB+gMICpgQICqgPICSgMIB8gGIB7gDIA+AAIA/ABIA+ABIBfAEQBAhZA6hcQAmg/Ajg/QAjhAAhhBIAghCIivAFIh1AEIh2AFIh1AHIh0AJIh0AJIg6AFIg6AFIg7AFIgnACIgnAAIgggCQg5BEg+BBgAJdzJQg9BohHBiQBzgMBzgKIDmgOIg6hmQgvg1gkg+Qgkg+gahCIgOgkQgzBug8BpgAEF91Io4AvIiiAbIB7EOIBggJIBfgOIAYgEIAsgCIBEgBICGgDICHgDICGgDICKgFICNgMIBGgJIAOgfIANggIANggIALggIALgjQAKgkAHgjIAIgtIl9gFg");
	this.shape_7.setTransform(347.1716,241.5667);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(226.7,41.1,233,400.9);


(lib.liquidmilk_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#F4F1E7").s().p("Ak7W/QgxgYgdgrQgcgpgLg7QgIgrgBhDQgDjQAmlWQAvmhAGiFQAIiYgElIQgEk6AKimQAJiGAThgQAah7AyheQAuhXBHgyQBRg5BQARQBMAQA4BNQAqA5AjBjQBACuAgCRQAnCuAACbQAAAvgGBfQgGBfAAAvQAAB8AjDvQAjD0ABB3QABEniCE5QgfBLgfA2QgmBCgsAxQg0A4hsBKQhAAtgqAUQg+Aeg4ABIgEAAQgyAAgugYg");
	this.shape.setTransform(139.5113,87.6567);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(95.3,-61.8,88.39999999999999,299);


(lib.measuringcup_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AgnA7IAAh1IAiAAQASAAAIADQAIADAGAKQAFAJAAAOQAAASgIAKQgHAMgMAAQgIAAgJgLIAAAxgAgEgHIABAAIACAAQADAAADgDQACgEAAgGQAAgHgCgDQgDgCgFAAIgBAAg");
	this.shape.setTransform(154.025,68.525);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AgRA2QgIgGgFgJQgFgKgCgLQgCgLAAgWIAAgsIAkAAIAAA3IAAAJQABABAAABQAAAAABABQAAAAABAAQAAAAAAAAQABAAAAAAQABAAAAgBQABAAAAgBQAAAAAAgBQABgEAAgKIAAgyIAkAAIAAAsIgBAbQgBAIgDAKQgDAJgGAHQgFAGgHAEQgHAEgHAAQgIAAgJgGg");
	this.shape_1.setTransform(144.175,68.625);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AgZAsQgMgRAAgaQAAgaAMgRQANgSASAAQAJAAAIAEQAJADAGAGIgOApQgGgDgJAAQgKAAAAAJQAAADACADQADACAFAAQAJAAAGgEIAOAtQgEAEgJAEQgJAEgLAAQgRAAgNgRg");
	this.shape_2.setTransform(135.075,68.525);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#000000").s().p("AgRA8IAAhnIAjgQIAAB3g");
	this.shape_3.setTransform(119.925,68.425);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#7F8082").s().p("AAmBCQgzAAhdgFQgkgCgSgDIgigGIgogFIhrgPQgZgEgLgDQgUgGgMgLQgGgEgBgEQgBgGAFgHQAHgIAOgGQAmgSAogDIAvgCQAUgBAkgFQAngFASgBQAfgCAzACIBSADIAzAAQAUAAAkAEIA4AFIAxABQBSAEBgAiQALAEADAFQAEAFgDAEQgDADgGAEIgGAJQgDADgIADIgiAKIgVAFQhLAQhMAFQgyADg8AAIgkAAg");
	this.shape_4.setTransform(136.7906,41.4423);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#B3B5B6").s().p("AmNDsIgqgBQgZgCgzgHQg1gHgZgIQgWgIgPgJQgIgFgPgNQgTgRgHgKQgPgWgHgjQgGgfgDhJIgDhiQgDhAABgnQANAJAVAFQARAGAfAEIBzAQIBQAKQAbADA7ADQAnADAnAAQAsABBXgDIA8gDQAtgEBIgOQAkgGAUgHQAXgHAOgKQAAAugDAvIgCAjIgVCTQgGAlgEANQgGAZgPAQQgKALgRALQgyAhhKANQgyAIhTABIhSABIhlgBgACfjAIgCAAIABgUIAAgYIAGAAIFlAAQA5AAAdABQAvADAlAHQAVAFAFAKQgIALgbADQiBAHkBACQhcgBgtgEgAJrjlQgGAAgFADQgDABgCACIAAAKIADAFIACAEQAEAFAHABIAQABIAWgCQAOgBAGgCQAHgBADgEQACgCABgDQABgDgDgDIgFgEIgGgDQgGgCgJgCIgkAAg");
	this.shape_5.setTransform(166.4,66.6);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#000000").s().p("AnWEvIg0gHQgmgGgWgFIgFgCQgtgNgjgeQglgfgOgqQgFgQgCgMQgGgdgCgyQgGiSgChqQAAgNAEgFQgCgPAKgQQAIgMAUgMQAigUA2gGQA8gDAfgEIA8gHQAfgDBAACIDAAGQAoAFAUABIAuABQBMADBgAeQAUAGAKAGQAPAJAFAMIADABQAFADABAHIAGAAIFlAAQA5AAAdABQAwACAlAIQAWAEAKAHQAHAFAEAIQAEAIgBAIQgCALgMAIQgJAFgOADQgTADgdABQhqAFj6ACQhgAAgrgDQgBA4gCAXQgEAqgNBTIgGAqQgGAjgFATQgJAegQASQgKAMgRAMQgnAbgzAQQgcAIgfAFQg5AJhoAAIhyAAQhQAAgngEgArDhGIADBhQADBKAGAfQAGAjAPAWQAIAKATARQAPANAIAGQAOAIAXAIQAZAIA1AHQAzAHAZACIAqABQBuACBJgCQBTgBAygIQBKgNAyghQARgKAKgLQAOgRAHgZQAEgNAFgkIAViUIADgjQACguABgvQgPAKgWAIQgUAGgkAGQhIAOgtAEIg8ADQhXADgsgBQgnAAgngDQg7gDgbgCIhQgKIhzgRQgggEgRgFQgUgGgOgJQAAAnADBAgAm8kUQgRABgnAFQglAFgUABIgvACQgnAEgnARQgNAHgHAIQgGAGACAHQABAEAFAFQANAKATAGQALAEAZAEIBsAPIAnAEIAiAGQASADAkACQBeAFA0ABQBQABBBgFQBNgFBKgQIAVgEIAhgKQAIgDADgEIAGgJQAHgDACgEQAEgEgEgGQgEgFgLgEQhfghhSgEIgwgCIg5gFQgjgDgVgBIgzAAIhSgDIgvgBIgkABgACjisIAAAVIACAAQAtAEBcAAQEBgBCBgIQAbgCAHgMQgFgKgUgEQglgIgwgCQgcgCg5AAIlmAAIgGAAgAJxieQgIgBgDgFIgDgDIgCgGIAAgKQACgCADgBQAFgDAGAAIAGAAIAlABQAIABAHACIAGADIAFAEQACADAAADQgBAEgCACQgDADgHACQgHACgNABIgWABgAJrixQABAGAFACQADACAHAAQAJAAASgCIAQgCIAFgCQgJgFgQAAIgZgBQgIAAgGACg");
	this.shape_6.setTransform(165.8455,62.56);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(91.7,31.8,148.39999999999998,61.5);


(lib.fullmeasuringcup_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AgnA7IAAh1IAiAAQASAAAIADQAIADAGAKQAFAJAAAOQAAASgIAKQgHAMgMAAQgIAAgJgLIAAAxgAgEgHIABAAIACAAQADAAADgDQACgEAAgGQAAgHgCgDQgDgCgFAAIgBAAg");
	this.shape.setTransform(154.025,68.525);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AgRA2QgIgGgFgJQgFgKgCgLQgCgLAAgWIAAgsIAkAAIAAA3IAAAJQABABAAABQAAAAABABQAAAAABAAQAAAAAAAAQABAAAAAAQABAAAAgBQABAAAAgBQAAAAAAgBQABgEAAgKIAAgyIAkAAIAAAsIgBAbQgBAIgDAKQgDAJgGAHQgFAGgHAEQgHAEgHAAQgIAAgJgGg");
	this.shape_1.setTransform(144.175,68.625);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AgZAsQgMgRAAgaQAAgaAMgRQANgSASAAQAJAAAIAEQAJADAGAGIgOApQgGgDgJAAQgKAAAAAJQAAADACADQADACAFAAQAJAAAGgEIAOAtQgEAEgJAEQgJAEgLAAQgRAAgNgRg");
	this.shape_2.setTransform(135.075,68.525);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#000000").s().p("AgRA8IAAhnIAjgQIAAB3g");
	this.shape_3.setTransform(119.925,68.425);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#F4F0E7").s().p("AhYAzIgIgBIgJAAQgdgBgPgCIgLgCQhogGhQgTIgKgCQgUgBgOgDIgOgEQgKgDgDgGQgEgFADgHIABgCIADgEIABgDIAEgGQAHgHAPgFIAOgEQAZgGAsgCQCMgHCVACQA0ABAbACIBWAGIA4AAQAiAAAXADQAQABAlAHQAiAGATACIAFAAQAOABAFACIAIAFQAIABAEAFQADAEAAAEIAAADIgBAEQgCAJgIAFQgFACgGACIgLABQgCADgFADQgIADgLACIgGABQg6AJg5AGQgIADgMAAIgqACQg9ADg8AAQhHAAhIgFg");
	this.shape_4.setTransform(136.6869,41.9207);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#7F8082").s().p("AAxBCQgzAAhegFQgkgCgSgDIgigGIgngFIhsgPQgZgEgLgDIgLgFQAOADATACIAKACQBRATBoAGIAKACQAPACAeABIAIAAIAJABQCCAKCGgJIApgBQANAAAIgEQA5gFA6gJIgRAEQhLAQhNAFQgyADg7AAIgkAAgAGLAaIALgBIgGACIgMAEQAEgCADgDgAmRgPIAAAAIgBADIgDAEQABgEADgDgAF8gWQgTgCgigGQglgHgQgBQgWgDgiAAIg5AAIhWgGQgagCg1gBQiVgCiLAHQgsACgaAGQAegLAdgCIAvgCQAUgBAlgFQAngFARgBQAggCAzACIBRADIAzAAQAVAAAjAEIA5AFIAwABQBIAEBQAZIgFAAg");
	this.shape_5.setTransform(135.7125,41.4423);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#B3B5B6").s().p("AmNDsIgqgBQgZgCgzgHQg1gHgZgIQgWgIgPgJQgIgFgPgNQgTgRgHgKQgPgWgHgjQgGgfgDhJIgDhiQgDhAABgnQANAJAVAFQARAGAfAEIBzAQIBQAKQAbADA7ADQAnADAnAAQAsABBXgDIA8gDQAtgEBIgOQAkgGAUgHQAXgHAOgKQAAAugDAvIgCAjIgVCTQgGAlgEANQgGAZgPAQQgKALgRALQgyAhhKANQgyAIhTABIhSABIhlgBgACfjAIgCAAIABgUIAAgYIAGAAIFlAAQA5AAAdABQAvADAlAHQAVAFAFAKQgIALgbADQiBAHkBACQhcgBgtgEgAJrjlQgGAAgFADQgDABgCACIAAAKIADAFIACAEQAEAFAHABIAQABIAWgCQAOgBAGgCQAHgBADgEQACgCABgDQABgDgDgDIgFgEIgGgDQgGgCgJgCIgkAAg");
	this.shape_6.setTransform(166.4,66.6);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#000000").s().p("AnWEvIg0gHQgmgGgWgFIgFgCQgtgNgjgeQglgfgOgqQgFgQgCgMQgGgdgCgyQgGiSgChqQAAgNAEgFQgCgPAKgQQAIgMAUgMQAigUA2gGQA8gDAfgEIA8gHQAfgDBAACIDAAGQAoAFAUABIAuABQBMADBgAeQAUAGAKAGQAPAJAFAMIADABQAFADABAHIAGAAIFlAAQA5AAAdABQAwACAlAIQAWAEAKAHQAHAFAEAIQAEAIgBAIQgCALgMAIQgJAFgOADQgTADgdABQhqAFj6ACQhgAAgrgDQgBA4gCAXQgEAqgNBTIgGAqQgGAjgFATQgJAegQASQgKAMgRAMQgnAbgzAQQgcAIgfAFQg5AJhoAAIhyAAQhQAAgngEgArDhGIADBhQADBKAGAfQAGAjAPAWQAIAKATARQAPANAIAGQAOAIAXAIQAZAIA1AHQAzAHAZACIAqABQBuACBJgCQBTgBAygIQBKgNAyghQARgKAKgLQAOgRAHgZQAEgNAFgkIAViUIADgjQACguABgvQgPAKgWAIQgUAGgkAGQhIAOgtAEIg8ADQhXADgsgBQgnAAgngDQg7gDgbgCIhQgKIhzgRQgggEgRgFQgUgGgOgJQAAAnADBAgAm8kUQgRABgnAFQglAFgUABIgvACQgeADgdALIgNADQgQAGgGAHIgEAGIAAAAQgDADgBAEIgBACQgDAHADAFQADAGALADIANAEIAMAEQALAEAZAEIBsAPIAnAEIAiAGQASADAkACQBeAFA0ABQBQABBBgFQBNgFBKgQIARgDIAFgBQAMgCAHgEIANgEIAGgDQAGgBAEgDQAIgEADgKIABgFIAAgCQgBgFgDgEQgEgEgHgCIgIgEQgGgCgOgBQhRgahGgDIgwgCIg5gFQgjgDgVgBIgzAAIhSgDIgvgBIgkABgACjisIAAAVIACAAQAtAEBcAAQEBgBCBgIQAbgCAHgMQgFgKgUgEQglgIgwgCQgcgCg5AAIlmAAIgGAAgAJxieQgIgBgDgFIgDgDIgCgGIAAgKQACgCADgBQAFgDAGAAIAGAAIAlABQAIABAHACIAGADIAFAEQACADAAADQgBAEgCACQgDADgHACQgHACgNABIgWABgAJrixQABAGAFACQADACAHAAQAJAAASgCIAQgCIAFgCQgJgFgQAAIgZgBQgIAAgGACg");
	this.shape_7.setTransform(165.8455,62.56);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(91.7,31.8,148.39999999999998,61.5);


(lib.strawberryfrosting_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#B3D6EB").s().p("AEsFdQgZgLgYgIQgYgHgJgMIAEggQAEgRAOgJQAPgIARgDIAOgEIAqBgIAAABIgCABIgJADQgHAFgBAJIgJgEgAjph/IgQgBQgTAAgWgGQgNgDgLgFIgHgGQgFgFAAgCIgBAAIAAgDIAAAAIAAgCQAFgKACgJIAGgZIAAgDIAAgBIABgCIAAgBIABgBIAAgBIABgCIAAgCIAOgHIAdgDIAcAAQAMgDAKgHQAIgGAHgJIACgEIAJgvQAGgcASgSIAKgDQALACAKAEQAPAFACATIADATIACANIAFAxQAEAWgFAaIggAPIgZAKIgJAGIgRAPIgQAMIgMALIgLgDg");
	this.shape.setTransform(0.65,0.525);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#D85986").s().p("AETETIAAgIIAFgCIAGgDIAAABIAAAMgABzDKIgcgPIgYgLIgWgKIgKgGIgcgOIi7hxQgOgKgMgMIgcgZQgIgHgHgIQgLgMgJgPQgGgKgDgLQgDgOAAgMQAAgRACgQQAAgLADgJIAKgfIAIgLQAdgfAogRIAlgRQAZgMAfABIAhAEQAXAEAVAQQAMAJALALIALAMIAUAaIASAZIARAaIASAZIAIANQARAbAPAbIAJAPIAHAOIARAbIAQAbIAQAfIASAhIAJASIAKASIgDAAIgKACIgHABQgLAEgKAFQgGACgFAEQgHAGgDAIQgIAPgDAPIgCAIIgGAOIgegQg");
	this.shape_1.setTransform(5.75,9.3212);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AEkFvIgLgFQgPgIgQgFIgNgEIgTgHIgJgFIgGgEIgZgLIgPgIIgbgOIgggPIgTgKIgagNIjGh2Ig1gwIgJgJIgPgRQgTgVgHgbIgDgLIgCgZIABgPIAFggQAAgFACgFIAKgdQglgDgngJIgLgFIgBgBIgGgDIgPgJIgEgHQgCgPAJgOIAAgIIAFgOIAAgDIABgCIABgEIABAAIADgMIABgDIABgCIAEgHQACgEAFgBQAMgGAOgFQAWACAXgCIAIAAIANgFQAKgOACgSIAGgdIAEgTQAGgSAOgMQAFgDAGgBQAMgGANAAQAGAAAGAEQALAEAKAJQADAEACAFQAFAQAEAQIADAZIAEAhIABAQIABAbIgBAMQAsgNAqAOIAKAEQAPAHANAIQAZAMAOARIAGAIIAPAVIALARIAUAaIAGAKIAPAWIAQAaIARAZIAIAQIASAdIAUAgIAUAjIATAkIAPAdIAQAcIABABIAsBhIAAArIgBgBIgGADIgEACIgBAIgAEXD2QgSADgOAIQgPAJgDARIgEAgQAIAMAYAHQAZAIAYALIAJAEQABgJAHgFIAJgDIACgBIAAgBIgqhggAhjirIglARQgoARgdAfIgIALIgKAfQgCAJgBALQgCAQAAARQAAALAEAOQACALAGAKQAJAPAMAMQAGAIAIAHIAcAaQAMAMAOAKIC7BxIAcAOIAKAGIAWAKIAYALIAdAPIAdAQIAGgOIACgIQAEgPAHgPQAEgIAGgGQAFgEAGgCQAKgFAMgEIAHgBIAKgCIACAAIgJgSIgJgSIgSghIgRgfIgQgbIgQgcIgHgOIgJgPQgQgbgRgaIgIgNIgSgZIgRgaIgSgZIgUgaIgLgMQgMgLgMgJQgVgQgWgEIgggEIgFAAQgdAAgXALgAkjjcIgOAHIAAACIgBACIAAABIgBABIAAABIgBACIAAABIAAADIgGAZQgCAJgFAKIAAACIABAAIAAADIABAAQAAACAEAFIAHAGQALAFAOADQAVAGAUAAIAPABIALADIANgLIAPgMIASgPIAJgGIAYgKIAggPQAFgagDgWIgGgxIgCgNIgDgTQgCgTgPgFQgKgEgKgCIgLADQgSASgFAcIgJAvIgDAEQgGAJgIAGQgLAHgMADIgcAAIgdADg");
	this.shape_2.setTransform(0.0318,0.125);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-34.3,-36.5,68.69999999999999,73.3);


(lib.frosting3_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFE9").s().p("AFwFrQgQgFgHgGQgJgEgJgKQgGgIgEgHQgFgOAPgWQAJgPANgQQAPgUgCgMQgCgLgLgHQgLgFgMAAQgSgBgcAIQgjAKgLACQgaAEgdgDQgigEgNgOIgBgBIABgKIAFgCIAGgDQADAFAIAEQAZALAogPIAhgMQASgGANgBQAVgBAWAGQAgAJANANQAWAWgJAYQgDAKgPAOQgPAQgDAJQgDAMADAMQAEANAKAHQALAGANgCQANgBAJgIIAMgNQAJgIAIACQAFAAADAEQACAFgCAEQgDAXgbALQgKAEgOAAQgKAAgNgDgAggB9IgdgPIgZgMIgXgLIgKgFIgdgPIjBhzQgPgLgMgMIgdgaIgOgQQgNgNgIgPQgHgLgDgLQgDgNgBgNQABgSABgQQABgLADgKIAKggIAJgLQAcggAqgRIAngSQAagMAfABIAiAEQAXAEAWARIAZAUIALAMIAVAbIASAaIARAaIATAbIAIANQATAbAPAdIAJAPIAIAOIAQAdIAQAcIASAgIASAhIAJASIALATIgEAAIgKACIgHABQgMAEgKAFQgGACgGAFQgHAGgDAIQgHAPgEAQIgCAIIgGAPIgegRg");
	this.shape.setTransform(90.2,67.0918);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#B3D6EB").s().p("AE1FnQgZgLgagIQgYgHgJgNIAEggQADgTAQgJQAPgIASgDIAOgEIArBjIAAABIgCABIgKADQgGAFgCAJIgJgEgAjwiDIgQgBQgUgBgWgFQgOgEgMgEIgGgHQgFgEAAgDIgBAAIAAgDIgBAAQAAAAAAAAQABgBAAAAQAAAAgBAAQAAgBAAAAQAGgKACgKIAFgaIABgCIAAgBIABgCIAAgBIABgCIAAgBIABgCIAAgCIANgHIAfgDIAdAAQANgDALgHQAHgGAHgJIADgFIAJgwQAFgdATgTIALgCQALABAKAEQAQAGACATIACAUIACANIAHAzQADAXgFAaIgiAPIgYALIgKAGIgSAPIgQANIgMALIgMgDg");
	this.shape_1.setTransform(69.75,49.725);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AGNHNQgMgFgPgNQgQgOgEgPQgIgWAQgdQAKgPAWgdQADgFgBgCQgBgGgHAAQgSgDgcAIIguANQgNABgaAAQgtABgWgLQgMgGgKgLIgCgBIgMgHIgCgBIgUgJQgPgIgRgFIgNgEIgTgIIgJgFIgHgEIgagLIgPgIIgbgOIghgQIgTgKIgbgPIjNh4Ig3gyIgJgIIgQgSQgTgVgIgcIgCgLIgCgbIABgPIAEghIADgLIAKgdQgmgDgogKIgMgFIgBgBIgFgEIgQgJIgFgGQgBgQAJgPIAAgIIACgGIADgIIAAgEIABgCIABgEIABAAIADgMIACgDIABgCIADgHQADgEAFgCQAMgGAOgFQAXACAYgCIAIgBIANgEQAKgOADgTIAGgdIAEgVQAGgSAPgMQAFgDAHgCQALgFANAAQAHAAAGADQALAFAKAJQAEAEACAGIAJAgIAEAZIADAiIABARIABAcIgBAMQAtgNAtAOIALAFQAOAGAOAJQAaANAPARIAGAJIAPAUIAMASIAUAbIAGAKIAPAXIAQAbIARAbIAJAQIATAeIAUAhIAUAjIAUAlIAQAeIAQAcIABABIA3B7IAAABIABAAIABAFIABAAIABADIACACQAIAFAOABQARgCAYgJIAogPQAagGAiAGQAnAHAXAWQAMAMAGAQQAGATgEAPQgGASgVAVQgLAJgBAIQgCAIAHAHQAGAHAIgBQAIgBAIgJQALgMAFgDQAFgDAMgCQAJAAAIAEQAJADAEALQADAJgCAMQgDARgSAPQgNAMgLAEQgJADgSAAQgcAAgRgJgAF4EeQAMAAALAFQALAHACALQACAMgPAUQgNARgJAOQgPAXAFANQADAHAHAIQAJAKAIAFQAHAFARAGQAcAGATgIQAbgLADgWQACgFgCgEQgDgFgFAAQgIgCgJAIIgMANQgJAJgOABQgMABgLgGQgKgHgEgMQgEgNAEgMQADgIAPgQQAPgPADgKQAJgYgWgWQgNgNgggJQgWgGgVABQgNABgTAHIggAMQgpAPgYgMQgJgDgCgGIgHADIgEADIgBAJIABABQANAOAhAEQAeADAagEQALgCAjgKQAZgHARAAIAEAAgAB+ChQgSADgPAIQgPAJgDASIgFAhQAJANAYAHQAaAIAZALIAJAEQACgKAGgEIAKgDIACgBIAAgCIgrhigAkHkNIgmASQgqARgdAhIgIALIgKAfQgDAKgBALQgCARAAARQAAANAEANQADALAGAMQAJAPAMANIAPAPIAcAaQAMALAPALIDCB0IAdAPIAKAFIAXALIAZAMIAcAPIAeARIAHgOIACgJQADgQAIgPQADgHAHgHQAFgEAHgDQAKgFAMgDIAHgBIAKgCIADAAIgKgUIgJgSIgTgiIgRggIgRgcIgQgbIgIgPIgJgPQgPgcgSgcIgIgNIgTgbIgRgaIgSgaIgVgbIgMgLIgYgVQgWgRgXgEIgigDIgFgBQgdAAgYALgAnNk/IgOAHIAAACIgBACIAAABIgBABIAAABIgBACIAAABIgBADIgFAaQgCAKgGAKQAAAAABAAQAAABAAAAQAAAAAAAAQgBABAAAAIABAAIAAACIABAAQAAAEAFAEIAGAHQAMAEAOAEQAWAFAUABIAQABIAMADIANgLIAQgNIASgPIAJgGIAZgLIAhgPQAFgbgDgWIgHgzIgBgNIgDgVQgCgTgQgFQgKgEgLgBIgLACQgSATgGAdIgJAwIgDAEQgGAJgIAHQgLAGgNAEIgdAAIgeADg");
	this.shape_2.setTransform(85.2256,58.55);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(33.8,11.6,102.89999999999999,94);


(lib.frosting2_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#36150F").s().p("AFNFJQgPgFgGgFQgIgEgHgJQgHgHgCgHQgFgMANgUIAUgcQAOgSgCgLQgCgKgKgGQgKgFgLAAQgQgBgaAHQgfAKgKABQgYAEgagDQgegDgNgNIgBgBIABgJIAEgCIAGgDQADAFAHAEQAXAKAkgOIAegLQAQgFANgBQASgBAUAFQAdAIAMAMQAUAUgIAWQgDAJgNANQgOAOgDAIQgDALADALQAEAMAJAGQAJAFAMgBQANgBAIgIIALgLQAHgIAIACQAFAAACAEQACAEgCAEQgDAVgYAJQgKAEgNAAQgJAAgLgCgAgdBxIgagOIgXgKIgVgKIgJgFIgagNIivhoQgOgKgKgLIgagYIgOgOQgKgMgJgNQgGgKgCgKQgDgNAAgLQAAgQABgPQABgKADgIIAJgdIAHgKQAbgeAlgPIAjgQQAYgLAdABIAeADQAVAEAUAPIAWATIALAKIASAZIARAXIAQAYIAQAYIAIAMQAQAZAPAaIAIANIAHANIAOAaIAPAaIAPAcIARAeIAIARIAKARIgDAAIgJACIgHABQgLADgJAFQgGACgFAEQgFAGgEAHQgGANgEAPIgBAHIgFANIgcgPg");
	this.shape.setTransform(78.7125,54.5372);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#B3D6EB").s().p("AEXFGQgWgKgXgIQgXgGgHgMIAEgdQACgRAOgIQAOgIARgCIAMgEIAnBZIAAABIgDABIgIAEQgFADgCAJIgJgDgAjah2IgNgBQgTAAgUgFIgXgIIgGgGQgEgEAAgDIgBAAIAAgCIgBAAQAAAAAAAAQABgBAAAAQAAAAgBAAQAAgBAAAAQAFgJACgJIAFgYIABgCIAAgBIABgBIAAgBIAAgCIAAgBIABgCIAAgBIAMgHIAcgDIAaAAQAMgDAKgGQAHgFAGgJIADgEIAIgrQAFgaARgSIAKgCIASAFQAPAFACARQAAAKACAJIABALIAHAvQACAUgEAZIgfAMIgWAKQgEADgEAEIgRANIgOAMIgMAKIgLgDg");
	this.shape_1.setTransform(60.2,38.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AFnGiQgLgFgNgMQgOgMgEgOQgIgTAPgbQAJgPAUgZQADgFgBgBQgBgFgGgBQgRgCgZAHIgqALQgLACgYAAQgpAAgUgKQgKgFgKgJIgBgCIgLgGIgCAAIgSgJQgOgHgPgGIgMgDIgRgHIgJgEIgFgEIgYgKIgOgIIgYgMIgegPIgRgJIgYgMIi6huIgygsIgIgIIgPgRQgRgSgHgaIgCgKIgCgZIABgNIAEgeIADgKIAJgbQgjgCgkgJIgLgEIgBgBIgFgEIgOgIIgEgFQgCgPAJgNIAAgHIABgHIAEgHIAAgCIAAgCIABgFIABAAIADgKIABgCIABgDIADgHQADgDAEgBQAMgGAMgEQAVACAWgCIAHgBIAMgEQAJgOADgQIAFgbIAEgSQAFgQANgMQAFgCAGgBQALgGALAAQAGABAGADQAKAEAJAIIAFAJQAFAOADAPIAEAXIADAfIABAPIABAaIgBALQApgMAoAMIAKAEQANAHANAHQAXAMANAQIAGAHIANATIALAQIASAZIAGAJIAOAUIAOAYIAPAZIAJAOIAQAcIATAdIASAgIASAhIAPAcIAOAZIABABIAxBwIAAAAIABABIACADIABAAIABAEIABACQAHAEANAAQAPgBAWgJIAlgMQAXgGAfAGQAjAFAUAVQAMALAFAPQAGAQgEAOQgFAQgTATQgKAJgBAGQgCAIAGAFQAGAHAHAAQAHgBAHgJQAKgLAFgCQAFgCAKgCQAIgBAHADQAJAEADAKQADAIgBAKQgEAPgPAPQgMAKgKAEQgIACgRABQgZAAgQgIgAFUEDQALAAAKAFQAKAGACALQACAKgOASIgUAcQgNAUAFANQACAGAHAHQAHAJAIAFQAGAEAPAGQAZAFASgIQAYgIADgWQACgDgCgFQgCgEgFAAQgIgCgHAIIgLAMQgIAHgNABQgMABgJgFQgJgGgEgMQgDgLADgKQADgJAOgOQANgNADgJQAIgWgUgUQgMgLgdgJQgUgFgSABQgNABgQAFIgeALQgkAOgXgKQgHgEgDgEIgGACIgEACIgBAJIABACQANAMAeADQAaADAYgEQAKgBAfgKQAXgGAPAAIAEAAgAByCSQgQACgOAIQgOAIgCARIgEAdQAHAMAXAGQAXAIAWAKIAJADQABgJAGgDIAIgEIADgBIAAgBIgnhZgAjujzIgjAQQglAPgbAeIgHAKIgJAdQgDAJgBAKQgBAOAAAQQAAALADANQACAKAGAKQAJANAKAMIAOAOIAaAYQAKAKAOAKICvBpIAaANIAJAGIAVAKIAXAJIAZAPIAcAOIAGgMIABgIQAEgPAGgNQAEgHAFgGQAFgEAGgCQAJgFALgDIAHgBIAJgBIADAAIgKgSIgIgQIgRggIgPgcIgPgaIgPgYIgHgOIgIgNQgPgagPgZIgIgLIgQgYIgQgZIgRgXIgSgZIgLgKIgWgSQgUgPgVgEIgegEIgFAAQgaAAgWAKgAmikhIgMAHIAAABIgBACIAAABIgBACIAAABIgBABIAAABIAAACIgFAYQgCAJgFAJQAAAAAAABQAAAAAAAAQAAAAAAABQAAAAAAAAIABAAIAAACIABAAQAAADAEAEIAGAGIAXAIQAUAFASAAIAOABIALADIAMgKIAOgMIARgNQADgEAFgDIAWgKIAegMQAFgZgDgUIgGgvIgBgLQgCgJgBgKQgCgRgOgFIgTgFIgKACQgQASgFAaIgJArIgCAEQgGAJgIAFQgKAGgLADIgaAAIgcADg");
	this.shape_2.setTransform(74.2138,46.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(27.6,4.3,93.30000000000001,85.10000000000001);


(lib.frosting1_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#B3D6EB").s().p("AEsFdQgZgLgZgIQgXgHgIgMIADggQADgRAPgJQAPgIASgDIANgEIAqBgIAAABIgCABIgJADQgHAFgBAJIgJgEgAjqh/IgOgBQgUAAgWgGQgNgDgMgFIgGgGQgEgFgBgCIgBAAIAAgDIAAAAIAAgCQAFgKACgJIAFgZIABgDIAAgBIABgCIAAgBIABgBIAAgBIABgCIAAgCIANgHIAegDIAcAAQAMgDAKgHQAJgGAGgJIACgEIAJgvQAGgcASgSIALgDQAKACAKAEQAPAFACATIACATIADANIAFAxQADAWgEAaIggAPIgYAKIgJAGIgSAPIgQAMIgMALIgMgDg");
	this.shape.setTransform(74.25,46.475);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#D85986").s().p("AFmFhQgRgFgHgGQgIgEgIgKQgHgHgDgHQgFgOAOgVIAWgfQAPgSgCgMQgDgMgKgGQgLgFgMAAQgRgBgbAIIgtAMQgZADgcgCQghgEgNgNIgBgBIAAgDIABgHIAFgDIAGgDIAAABQADAFAHADQAZALAngOIAfgMQASgGANgBQAUgBAVAGQAgAIAMANQAWAVgIAYQgEAJgOAPQgPAPgDAJQgEALAEAMQAEANAKAGQAKAGAMgCQAOgBAJgIIALgMQAIgIAIACQAGAAADAEQABAFgBAEQgEAWgaAKQgKAEgNAAQgKAAgMgCgAgfB6IgcgQIgYgKIgXgLIgKgFIgbgPIi9hvQgOgLgMgLIgbgaQgIgHgHgIQgLgNgJgOQgGgLgDgLQgEgNAAgNQAAgRACgQQABgKADgJIAKggIAIgKQAcgfAogRIAmgRQAZgMAfABIAgADQAYAFAUAQQANAJALALIAMALIATAaIASAZIARAaIASAaIAIAMQASAbAPAcIAJAOIAHAOIAPAcIAQAcIARAeIASAgIAJASIAKATIgDAAIgKACIgHAAQgLAEgKAFQgGACgGAFQgGAGgEAIQgHAOgDAPIgCAIIgFAPIgegQg");
	this.shape_1.setTransform(94.0625,63.3418);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AGBHAQgMgFgOgMQgPgOgFgOQgIgWAQgcQAKgPAWgcQACgFAAgCQgBgFgIAAQgRgDgbAHIgtAMQgMACgZAAQgsAAgVgKQgMgGgKgKIgCgBIgLgHIgCgBIgJgEIgLgEQgPgJgQgFIgMgDIgTgIIgJgFIgGgEIgZgKIgQgIIgZgPIghgPIgSgKIgagNIjHh2Ig2gvIgJgIIgPgSQgTgUgHgbIgDgMIgBgaIABgOIAEggQABgGACgFIAKgcQgmgDgmgJIgMgFIgBgBIgFgEIgPgJIgFgGQgCgPAJgPIAAgIIAGgOIAAgDIABgBIAAgFIABAAIADgLIACgDIABgDIADgHQADgDAEgBQANgHANgEQAXACAXgCIAIgBIAMgEQAKgPADgSIAFgcIAFgUQAFgSAOgLQAGgEAGgBQAMgFAMAAQAGAAAHAEQAKAEAKAIQAEAEABAGQAGAQADAQIAEAYIAEAhIAAAQIABAcIgBALQAsgMArANIALAFQAOAGANAIQAZANAPARIAGAIIAOAUIAMARIATAbIAHAKIAOAVIAPAaIARAbIAJAPIASAdIATAhIAUAhIAUAkIAPAeIAPAbIABABIA2B3IAAABIACAEIABAAIABAEIACACQAHAFAOAAQAQgBAYgKIAngNQAZgGAhAGQAmAGAWAWQAMALAGAQQAGASgFAPQgFARgVAVQgKAJgBAHQgCAIAGAGQAHAHAIgBQAHAAAIgJQAKgMAFgDQAFgCAMgCQAIAAAIADQAJADADALQAEAJgCAKQgDARgRAQQgNAKgKAFQgJACgSAAQgbAAgRgIgAFsEWQAMAAALAFQAKAGADAMQACAMgPASIgWAfQgOAVAFAOQADAHAHAHQAIAKAIAEQAHAGARAFQAaAGATgIQAagKAEgWQABgEgBgFQgDgEgGAAQgIgCgIAIIgLAMQgJAIgOABQgMACgKgGQgKgGgEgNQgEgMAEgLQADgJAPgPQAOgPAEgJQAIgYgWgVQgMgNgggIQgVgGgUABQgNABgSAGIgfAMQgnAOgZgLQgHgDgDgFIAAgBIgGADIgFADIgBAHIAAADIABABQANANAhAEQAcACAZgDIAtgMQAYgHARAAIADAAgAB6CcQgRADgPAIQgPAJgDASIgEAfQAIANAYAHQAZAIAYALIAJADQACgJAGgEIAJgEIADgBIAAgBIgqhfgAj/kEIgmARQgoARgcAfIgIAKIgKAgQgDAJgBAKQgCAQAAARQAAANAEANQADALAGALQAJAOALANQAHAIAIAHIAbAZQAMALAOALIC9BwIAbAPIAKAFIAXALIAYAKIAbAQIAeAQIAGgPIACgIQADgPAHgOQAEgIAGgGQAGgFAGgCQAKgFALgEIAHAAIAKgCIADAAIgKgTIgJgSIgSghIgRgeIgQgcIgQgbIgHgOIgJgOQgPgcgRgbIgIgMIgSgaIgRgaIgSgZIgTgaIgMgLQgLgLgNgJQgUgQgYgFIgggDIgEAAQgdAAgXALgAnAk2IgNAIIAAABIgBACIAAABIgBACIAAABIgBACIAAAAIgBADIgFAZQgCAKgFAKIAAACIAAAAIAAACIABAAQAAADAFAEIAGAHQAMAEANAEQAWAFATABIAPABIAMACIAMgKIAQgNIARgOIAJgGIAZgLIAggOQAEgagDgWIgGgyIgCgMIgCgUQgCgSgPgGQgKgDgLgCIgKACQgSASgGAdIgJAuIgCAFQgHAJgIAGQgKAGgNAEIgbAAIgeACg");
	this.shape_2.setTransform(89.2652,55.025);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(39.3,9.4,100.00000000000001,91.3);


(lib.justflour_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#3D260E").s().p("AAPB/IAAgDQAAgsgIgYQgIgXgPAAIgBAAIAABeIhMAAIAAj9IBMAAQAnAAANADQANADAKAJQAKAJAHARQAFAQAAASQAAAmgTASQAcAvAFBLgAgRgZIACAAQALAAAEgGQAFgGAAgNQAAgXgVAAIgBAAg");
	this.shape.setTransform(141.975,159.275);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#3D260E").s().p("AglB0QgTgMgKgVQgLgUgEgYQgEgYABgwIAAhfIBLAAIAAB2QAAAOACAHQACAHAFAAQAGAAABgIQACgIAAgXIAAhrIBNAAIAABfQAAAogCASQgCATgGAUQgIAUgLAOQgLAPgPAIQgQAIgPAAQgSAAgTgNg");
	this.shape_1.setTransform(119.85,159.475);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#3D260E").s().p("Ag9BfQgagkAAg/QAAggALgcQALgdAUgTQAUgSAcAAQAiAAAaAmQAZAmAAA1QAAA6gZAlQgZAlgnAAQghAAgbgkgAgLgZQgGAIAAALQAAALAFAHQAFAIAHAAQAIAAAEgIQAFgHAAgLQAAgLgFgIQgEgHgIAAQgGAAgFAHg");
	this.shape_2.setTransform(98.975,159.275);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#3D260E").s().p("AhGB/IAAj9IBKAAIAAC9IBEAAIAABAg");
	this.shape_3.setTransform(80.75,159.275);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#3D260E").s().p("AhHB/IAAj9ICOAAIAABAIhCAAIAAAuIAwAAIAAA/IgwAAIAABQg");
	this.shape_4.setTransform(63.15,159.275);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#F9EFE3").s().p("ABLFSIhIgNQgpgIgdAFQggAIgQABQgMAAgFADIgvgcQgjgVgWgKQgzgXhZgOQhzgSgcgHQg0gOhMghQgmgQgUgOQgegVgLgbQgEgKgBgKIADgFQADgGAEgPQAEgOAEgHQAIgNASgJIAhgPQAigPAVgXIAcgiQAQgUAPgIQALgGAQgDIAdgEQBEgIAigbQAWgRAUglIAQgeQALgQAMgIQAQgJAjABQAlAAAPgGQANgGAYgXQAWgVARgEQAQgDAaALQAhANAJABQAJACAXgCQAUgBAKADQALADAOALIAXARQAoAcAxgEIAegFQASgCALADQAPAEASAQQAXAUAHAEQAVANAkABQAUAAAjgDQAogFAQAAQBFgBAiAiQANAOATAlQASAjAQANIACACQARAQAtAeQAqAbAUAXQAeAkgEAmQgDAZgVAfQgPAXgNAKIgWAPQgMAKgLAOQgHgCgHADQgXAHgpAaQgpAagXAGQgYAIgogBIhCgCQgkACg4ARQhIAXgSAEQglAIglAAQgaAAgagEg");
	this.shape_5.setTransform(96.3789,41.6379);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#000000").s().p("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");
	this.shape_6.setTransform(99.4281,108.192);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#C49456").s().p("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");
	this.shape_7.setTransform(99.4546,108.124);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,198.9,216.4);


(lib.flour3_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// cups
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AgnA7IAAh1IAiAAQASAAAIADQAIADAGAKQAFAJAAAOQAAASgIAKQgHAMgMAAQgIAAgJgLIAAAxgAgEgHIABAAIACAAQADAAADgDQACgEAAgGQAAgHgCgDQgDgCgFAAIgBAAg");
	this.shape.setTransform(408.025,80.775);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AgRA2QgIgGgFgJQgFgKgCgLQgCgLAAgWIAAgsIAkAAIAAA3IAAAJQAAABABABQAAAAABABQAAAAABAAQAAAAAAAAQABAAAAAAQABAAAAgBQABAAAAgBQAAAAAAgBQABgEAAgKIAAgyIAkAAIAAAsIgBAbQgBAIgDAKQgDAJgGAHQgFAGgHAEQgHAEgHAAQgIAAgJgGg");
	this.shape_1.setTransform(398.175,80.875);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AgZAsQgMgRAAgaQAAgaAMgRQANgSASAAQAJAAAIAEQAJADAGAGIgOApQgGgDgJAAQgKAAAAAJQAAADACADQADACAFAAQAJAAAGgEIAOAtQgEAEgJAEQgJAEgLAAQgRAAgNgRg");
	this.shape_2.setTransform(389.075,80.775);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#000000").s().p("AgRA8IAAhnIAjgQIAAB3g");
	this.shape_3.setTransform(373.925,80.675);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#000000").s().p("AgnA7IAAh1IAiAAQASAAAIADQAIADAGAKQAFAJAAAOQAAASgIAKQgHAMgMAAQgIAAgJgLIAAAxgAgEgHIABAAIACAAQADAAADgDQACgEAAgGQAAgHgCgDQgDgCgFAAIgBAAg");
	this.shape_4.setTransform(408.075,149.875);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#000000").s().p("AgRA2QgIgGgFgJQgFgKgCgLQgCgLAAgWIAAgsIAkAAIAAA3IAAAJQABABAAABQAAAAABABQAAAAABAAQAAAAAAAAQAAAAABAAQABAAAAgBQABAAAAgBQAAAAAAgBQABgEAAgKIAAgyIAkAAIAAAsIgBAbQgBAIgDAKQgDAJgGAHQgFAGgHAEQgHAEgHAAQgIAAgJgGg");
	this.shape_5.setTransform(398.225,149.975);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#000000").s().p("AgZAsQgMgRAAgaQAAgaAMgRQANgSASAAQAJAAAIAEQAJADAGAGIgOApQgGgDgJAAQgKAAAAAJQAAADACADQADACAFAAQAJAAAGgEIAOAtQgEAEgJAEQgJAEgLAAQgRAAgNgRg");
	this.shape_6.setTransform(389.125,149.875);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#000000").s().p("AgRA8IAAhnIAjgQIAAB3g");
	this.shape_7.setTransform(373.975,149.775);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#000000").s().p("AgnA7IAAh1IAiAAQASAAAIADQAIADAGAKQAFAJAAAOQAAASgIAKQgHAMgMAAQgIAAgJgLIAAAxgAgEgHIABAAIACAAQADAAADgDQACgEAAgGQAAgHgCgDQgDgCgFAAIgBAAg");
	this.shape_8.setTransform(410.075,217.525);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#000000").s().p("AgRA2QgIgGgFgJQgFgKgCgLQgCgLAAgWIAAgsIAkAAIAAA3IAAAJQABABAAABQAAAAABAAQAAABABAAQAAAAAAAAQABAAAAAAQABAAAAgBQABAAAAgBQAAAAAAgBQABgEAAgKIAAgyIAkAAIAAAsIgBAbQgBAIgDAKQgDAJgGAHQgFAGgHAEQgHAEgHAAQgIAAgJgGg");
	this.shape_9.setTransform(400.225,217.625);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#000000").s().p("AgZAsQgMgRAAgaQAAgaAMgRQANgSASAAQAJAAAIAEQAJADAGAGIgOApQgGgDgJAAQgKAAAAAJQAAADACADQADACAFAAQAJAAAGgEIAOAtQgEAEgJAEQgJAEgLAAQgRAAgNgRg");
	this.shape_10.setTransform(391.125,217.525);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#000000").s().p("AgRA8IAAhnIAjgQIAAB3g");
	this.shape_11.setTransform(375.975,217.425);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#B3B5B6").s().p("AmDOYIgqgBQgYgCg0gHQg1gHgYgIQgXgIgOgJQgJgFgPgNQgTgRgHgKQgPgWgGgjQgHgfgDhKIgDhiQgChAAAgnQAOAJAUAFQARAFAfAFIBzAQIBQAKIBWAGQAnACAnABQAsABBXgDIA9gDQAsgEBIgOQAlgHATgGQAXgHAOgKQAAAugDAvIgCAiIgVCVQgGAkgEANQgGAagPAQQgJALgRALQg0AhhIAMQgzAJhTABIhSABIhlgBgACqHrIgDAAIABgUIAAgYIAGAAIFlAAQA5AAAdABQAvADAmAHQAUAEAFALQgIALgbACQiAAIkCABQhbAAgtgEgAJ1HGQgGAAgFADQgDABgBACIgBAJIADAGIACAEQAEAFAIABIAPABIAXgCQANgBAGgCQAHgCADgDQADgCABgEQAAgDgDgCIgFgEIgGgDQgGgDgJgBIgkgBgAmXDzIgqgBQgYgCg0gHQg1gHgYgIQgXgIgOgIQgJgGgPgNQgTgRgHgKQgPgWgGgjQgHgfgDhJIgDhiQgChAAAgnQAOAJAUAGQARAFAfAEIBzARIBQAKIBWAFQAnADAnAAQAsABBXgDIA9gDQAsgEBIgOQAlgGATgGQAXgIAOgKQAAAvgDAuIgCAjIgVCUQgGAkgEANQgGAZgPARQgJALgRAKQgzAhhJANQgzAIhTABIhSABIhlgBgACWi4IgDAAIABgVIAAgYIAGAAIFlAAQA5AAAdACQAvACAmAIQAUAEAFAKQgIAMgbACQiAAIkCABQhbAAgtgEgAJhjeQgGAAgFADQgDABgBACIgBAKIADAGIACADQAEAFAIABIAPABIAXgBQANgBAGgCQAHgCADgDQADgCABgEQAAgDgDgDIgFgEIgGgDQgGgCgJgBIgkgBgAmXm/IgqgBQgZgCgzgHQg1gHgZgIQgXgIgOgIQgIgGgPgNQgTgRgIgKQgPgWgGgjQgGgfgDhKIgDhiQgDhAAAgnQAOAJAUAGQARAFAgAEIBzARIBQAKIBWAFQAnADAnAAQAsABBXgDIA8gDQAtgEBIgOQAkgGAUgGQAWgIAPgKQgBAvgCAuIgDAjIgVCVQgFAkgEANQgHAZgOARQgKALgRAKQgyAhhKANQgyAIhTABIhSABIhlgBgACVtrIgCAAIAAgVIAAgYIAGAAIFmAAQA5AAAcACQAwACAlAIQAUAEAFAKQgHAMgbACQiBAIkBABQhcAAgtgEgAJhuRQgGAAgFADQgDABgCACIAAAKIACAGIADADQADAFAIABIAQABIAWgBQANgBAHgCQAHgCADgDQACgCABgEQAAgDgCgDIgFgEIgGgDQgHgCgIgBIglgBg");
	this.shape_12.setTransform(421.425,147.225);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#7F8082").s().p("AAwLuQgzgBhdgFQgkgCgSgDIgigGIgogEIhrgPQgZgEgLgEQgUgGgMgKQgGgFgBgEQgBgHAFgGQAHgIAOgHQAmgRAogEIAvgCQAUgBAkgFQAngFASgBQAfgCAzACIBSADIAzAAQAUABAkADIA4AFIAxACQBSAEBgAhQALAEADAFQAEAGgDAEQgDAEgGADIgGAJQgDAEgIADIgiAKIgVAEQhLAQhMAFQgyAEg7AAIglAAgAAcBJQgzAAhdgFQgkgCgSgDIgigGIgogFIhrgPQgZgEgLgDQgUgGgMgLQgGgEgBgFQgBgFAFgHQAHgIAOgGQAmgSAogDIAvgCQAUgBAkgFQAngFASgBQAfgCAzACIBSADIAzAAQAUAAAkAEIA4AFIAxABQBSAEBgAiQALAEADAEQAEAGgDAEQgDADgGAEIgGAJQgDADgIADIgiAKIgVAFQhLAQhMAFQgyAEg7AAIglgBgAAcppQgzAAhegFQgkgCgSgDIgigGIgngFIhsgPQgZgEgLgDQgTgGgNgLQgFgEgBgFQgCgGAGgHQAHgIANgGQAngSAngDIAvgCQAUgBAlgFQAngFARgBQAggCAzACIBRADIAzAAQAVAAAjAEIA5AFIAwABQBTAEBfAiQALAEAEAFQAEAGgEAEQgCADgHAEIgGAJQgDADgIADIghAKIgVAFQhLAQhNAFQgyAEg7AAIgkgBg");
	this.shape_13.setTransform(391.8156,122.0673);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#000000").s().p("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");
	this.shape_14.setTransform(420.8705,143.185);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	// flour
	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#3D260E").s().p("AAPB/IAAgDQAAgsgIgYQgIgXgPAAIgBAAIAABeIhMAAIAAj9IBMAAQAnAAANADQANADAKAJQAKAJAHARQAFAQAAASQAAAmgTASQAcAvAFBLgAgRgZIACAAQALAAAEgGQAFgGAAgNQAAgXgVAAIgBAAg");
	this.shape_15.setTransform(318.125,197.775);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#3D260E").s().p("AglB0QgTgMgKgVQgLgUgEgYQgEgYABgwIAAhfIBLAAIAAB2QAAAOADAHQABAHAFAAQAGAAABgIQACgIAAgXIAAhrIBNAAIAABfQgBAogBASQgCATgGAUQgIAUgLAOQgMAPgOAIQgPAIgQAAQgSAAgTgNg");
	this.shape_16.setTransform(296,197.975);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#3D260E").s().p("Ag9BfQgagkAAg/QAAggALgcQALgdAUgTQAUgSAcAAQAiAAAaAmQAZAmAAA1QAAA6gZAlQgZAlgnAAQghAAgbgkgAgLgZQgGAIAAALQAAALAFAHQAFAIAHAAQAIAAAEgIQAFgHAAgLQAAgLgFgIQgEgHgIAAQgGAAgFAHg");
	this.shape_17.setTransform(275.125,197.775);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#3D260E").s().p("AhGB/IAAj9IBKAAIAAC9IBEAAIAABAg");
	this.shape_18.setTransform(256.9,197.775);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#3D260E").s().p("AhHB/IAAj9ICOAAIAABAIhCAAIAAAuIAwAAIAAA/IgwAAIAABQg");
	this.shape_19.setTransform(239.3,197.775);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#C49456").s().p("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");
	this.shape_20.setTransform(275.6046,146.624);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#F9EFE3").s().p("ABLFSIhIgNQgpgIgdAFQggAIgQABQgLAAgGADIgvgcQgjgVgWgKQgzgXhZgOQhzgSgcgHQg0gOhMghQgmgQgUgOQgegVgLgbQgEgKgBgKIADgFQADgGAEgPQAEgOAEgHQAIgNASgJIAhgPQAigPAVgXIAcgiQAQgUAPgIQALgGAQgDIAdgEQBEgIAigbQAWgRAUglIAQgeQALgQAMgIQAQgJAjABQAlAAAPgGQANgGAYgXQAWgVARgEQAQgDAaALQAhANAJABQAJACAXgCQAUgBAKADQALADAOALIAXARQAoAcAxgEIAegFQASgCALADQAPAEASAQQAXAUAHAEQAVANAkABQAUAAAjgDQAogFAQAAQBFgBAiAiQANAOATAlQASAjAQANIACACQASAQAsAeQAqAbAUAXQAeAkgEAmQgDAZgVAfQgPAXgNAKIgWAPQgMAKgLAOQgHgCgHADQgXAHgpAaQgpAagXAGQgYAIgogBIhCgCQgkACg4ARQhIAXgSAEQglAIglAAQgaAAgagEg");
	this.shape_21.setTransform(272.5164,80.1379);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#000000").s().p("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");
	this.shape_22.setTransform(275.5781,146.692);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(176.2,38.5,319.90000000000003,216.4);


(lib.flour2_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// cups
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AgnA7IAAh1IAiAAQASAAAIADQAIADAGAKQAFAJAAAOQAAASgIAKQgHAMgMAAQgIAAgJgLIAAAxgAgEgHIABAAIACAAQADAAADgDQACgEAAgGQAAgHgCgDQgDgCgFAAIgBAAg");
	this.shape.setTransform(408.075,149.875);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AgRA2QgIgGgFgJQgFgKgCgLQgCgLAAgWIAAgsIAkAAIAAA3IAAAJQABABAAABQAAAAABABQAAAAABAAQAAAAAAAAQAAAAABAAQABAAAAgBQABAAAAgBQAAAAAAgBQABgEAAgKIAAgyIAkAAIAAAsIgBAbQgBAIgDAKQgDAJgGAHQgFAGgHAEQgHAEgHAAQgIAAgJgGg");
	this.shape_1.setTransform(398.225,149.975);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AgZAsQgMgRAAgaQAAgaAMgRQANgSASAAQAJAAAIAEQAJADAGAGIgOApQgGgDgJAAQgKAAAAAJQAAADACADQADACAFAAQAJAAAGgEIAOAtQgEAEgJAEQgJAEgLAAQgRAAgNgRg");
	this.shape_2.setTransform(389.125,149.875);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#000000").s().p("AgRA8IAAhnIAjgQIAAB3g");
	this.shape_3.setTransform(373.975,149.775);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#000000").s().p("AgnA7IAAh1IAiAAQASAAAIADQAIADAGAKQAFAJAAAOQAAASgIAKQgHAMgMAAQgIAAgJgLIAAAxgAgEgHIABAAIACAAQADAAADgDQACgEAAgGQAAgHgCgDQgDgCgFAAIgBAAg");
	this.shape_4.setTransform(410.075,217.525);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#000000").s().p("AgRA2QgIgGgFgJQgFgKgCgLQgCgLAAgWIAAgsIAkAAIAAA3IAAAJQABABAAABQAAAAABAAQAAABABAAQAAAAAAAAQABAAAAAAQABAAAAgBQABAAAAgBQAAAAAAgBQABgEAAgKIAAgyIAkAAIAAAsIgBAbQgBAIgDAKQgDAJgGAHQgFAGgHAEQgHAEgHAAQgIAAgJgGg");
	this.shape_5.setTransform(400.225,217.625);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#000000").s().p("AgZAsQgMgRAAgaQAAgaAMgRQANgSASAAQAJAAAIAEQAJADAGAGIgOApQgGgDgJAAQgKAAAAAJQAAADACADQADACAFAAQAJAAAGgEIAOAtQgEAEgJAEQgJAEgLAAQgRAAgNgRg");
	this.shape_6.setTransform(391.125,217.525);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#000000").s().p("AgRA8IAAhnIAjgQIAAB3g");
	this.shape_7.setTransform(375.975,217.425);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#B3B5B6").s().p("AmDI+IgqgBQgZgCgzgHQg1gHgZgIQgWgIgPgIQgIgGgPgNQgTgRgHgKQgPgWgHgjQgGgfgDhKIgDhiQgDhAABgnQANAJAVAGQARAFAfAEIBzARIBQAKIBWAFQAnADAnAAQAsABBXgDIA8gDQAtgEBIgOQAkgGAUgGQAXgIAOgKQAAAvgDAuIgCAjIgVCVQgGAkgEANQgGAZgPARQgKALgRAKQgzAhhJANQgyAIhTABIhSABIhlgBgACpCSIgCAAIABgVIAAgYIAGAAIFlAAQA5AAAdACQAvACAlAIQAVAEAFAKQgIAMgbACQiBAIkBABQhcAAgtgEgAJ1BsQgGAAgFADQgDABgCACIAAAKIADAGIACADQAEAFAHABIAQABIAWgBQAOgBAGgCQAHgCADgDQACgCABgEQAAgDgCgDIgFgEIgGgDQgGgCgJgBIgkgBgAmXhlIgqgBQgZgCgzgHQg1gHgZgIQgWgIgPgJQgIgFgPgNQgTgRgHgKQgQgWgGgjQgGgfgDhKIgDhiQgChAAAgnQAOAJATAFQASAFAfAFIBzAQIBQAKIBWAGQAnACAnABQAsABBXgDIA9gDQAsgEBIgOQAkgHAUgGQAWgHAPgKQAAAugDAvIgCAiIgWCVQgFAkgEANQgHAagOAQQgJALgSALQgyAhhKAMQgyAJhTABIhSABIhlgBgACWoSIgDAAIABgUIAAgYIAFAAIFmAAQA5AAAdABQAvADAmAHQATAEAGALQgIALgbACQiAAIkCABQhcAAgsgEgAJho3QgGAAgFADQgDABgCACIAAAJIACAGIADAEQADAFAIABIAQABIAWgCQANgBAHgCQAHgCADgDQACgCACgEQgBgDgCgCIgFgEIgGgDQgHgDgIgBIgkgBg");
	this.shape_8.setTransform(421.45,181.775);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#7F8082").s().p("AAwGUQgzAAhdgFQgkgCgSgDIgigGIgogFIhrgPQgZgEgLgDQgUgGgMgLQgGgEgBgFQgBgGAFgHQAHgIAOgGQAmgSAogDIAvgCQAUgBAkgFQAngFASgBQAfgCAzACIBSADIAzAAQAUAAAkAEIA4AFIAxABQBSAEBgAiQALAEADAFQAEAGgDAEQgDADgGAEIgGAJQgDADgIADIgiAKIgVAFQhLAQhMAFQgyAEg7AAIglgBgAAckPQgzgBhdgFQgkgCgSgDIgigGIgogEIhrgPQgZgEgLgEQgUgGgMgKQgGgFgBgEQgBgHAFgGQAHgIAOgHQAmgRAogEIAvgCQAUgBAkgFQAngFASgBQAfgCAzACIBSADIAzAAQAUABAkADIA4AFIAxACQBSAEBgAhQALAEADAFQAEAGgDAEQgDAEgGADIgGAJQgDAEgIADIgiAKIgVAEQhLAQhMAFQgyAEg8AAIgkAAg");
	this.shape_9.setTransform(391.8406,156.6173);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#000000").s().p("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");
	this.shape_10.setTransform(420.8955,177.735);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	// flour
	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#3D260E").s().p("AAPB/IAAgDQAAgsgIgYQgIgXgPAAIgBAAIAABeIhMAAIAAj9IBMAAQAnAAANADQANADAKAJQAKAJAHARQAFAQAAASQAAAmgTASQAcAvAFBLgAgRgZIACAAQALAAAEgGQAFgGAAgNQAAgXgVAAIgBAAg");
	this.shape_11.setTransform(318.125,197.775);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#3D260E").s().p("AglB0QgTgMgKgVQgLgUgEgYQgEgYABgwIAAhfIBLAAIAAB2QAAAOADAHQABAHAFAAQAGAAABgIQACgIAAgXIAAhrIBNAAIAABfQgBAogBASQgCATgGAUQgIAUgLAOQgMAPgOAIQgPAIgQAAQgSAAgTgNg");
	this.shape_12.setTransform(296,197.975);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#3D260E").s().p("Ag9BfQgagkAAg/QAAggALgcQALgdAUgTQAUgSAcAAQAiAAAaAmQAZAmAAA1QAAA6gZAlQgZAlgnAAQghAAgbgkgAgLgZQgGAIAAALQAAALAFAHQAFAIAHAAQAIAAAEgIQAFgHAAgLQAAgLgFgIQgEgHgIAAQgGAAgFAHg");
	this.shape_13.setTransform(275.125,197.775);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#3D260E").s().p("AhGB/IAAj9IBKAAIAAC9IBEAAIAABAg");
	this.shape_14.setTransform(256.9,197.775);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#3D260E").s().p("AhHB/IAAj9ICOAAIAABAIhCAAIAAAuIAwAAIAAA/IgwAAIAABQg");
	this.shape_15.setTransform(239.3,197.775);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#C49456").s().p("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");
	this.shape_16.setTransform(275.6046,146.624);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#F9EFE3").s().p("ABLFSIhIgNQgpgIgdAFQggAIgQABQgLAAgGADIgvgcQgjgVgWgKQgzgXhZgOQhzgSgcgHQg0gOhMghQgmgQgUgOQgegVgLgbQgEgKgBgKIADgFQADgGAEgPQAEgOAEgHQAIgNASgJIAhgPQAigPAVgXIAcgiQAQgUAPgIQALgGAQgDIAdgEQBEgIAigbQAWgRAUglIAQgeQALgQAMgIQAQgJAjABQAlAAAPgGQANgGAYgXQAWgVARgEQAQgDAaALQAhANAJABQAJACAXgCQAUgBAKADQALADAOALIAXARQAoAcAxgEIAegFQASgCALADQAPAEASAQQAXAUAHAEQAVANAkABQAUAAAjgDQAogFAQAAQBFgBAiAiQANAOATAlQASAjAQANIACACQASAQAsAeQAqAbAUAXQAeAkgEAmQgDAZgVAfQgPAXgNAKIgWAPQgMAKgLAOQgHgCgHADQgXAHgpAaQgpAagXAGQgYAIgogBIhCgCQgkACg4ARQhIAXgSAEQglAIglAAQgaAAgagEg");
	this.shape_17.setTransform(272.5164,80.1379);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#000000").s().p("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");
	this.shape_18.setTransform(275.5781,146.692);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(176.2,38.5,319.90000000000003,216.4);


(lib.yolk_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFD56C").s().p("AhCKSQgqgMgkghQgggegWgsQgSgkgMgxQgIghgKg5Qg1lJAEj4QAChyAShPQAYhoA1hGQAug9A4gRQA5gRA4AeQA5AeATA5QAGARAFAjQAGAkAFAQQAHAUANAWIAaAnQAzBKAcA2QAlBJALBDQAHAnABA1IgBBbIABCtQgEBjgYBFQgfBWhGBGQgyAyg7AYQgoAQglAAQgYAAgXgHg");
	this.shape.setTransform(131.9159,132.053);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#F4E7D7").s().p("AAOQ5QhOgHhIgwQhEgtgxhHQgrg+gehUQgYhCgUhdIgdihQgShigSg/IgwiWQgdhagGg/QgEgxAEg9QADgoAKhGQALhIAEgcQAKg4AMgqQAQg2AbhAQASgpAjhIQAphSAZgoQAohCAugqQAggeAwgdQAbgRA8ggQAugZAYgLQAogTAkgJQBbgYBNAeQApAQAeAfQAgAgAMApQANAtgMBFQgGAmgQBOQgHA6AKBHQAHAxAUBPIA9D0QAjCPASBnQAtEZguDTIgMA1QgFAfACAXQACAWAMAnQALApADATQAGA1gZA1QgYAygrAlQgnAhg3AZQgnAThAAVQg+AWgrAIQgsAJgnAAIgagBgAh5orQg5ASgtA8Qg2BGgXBoQgSBPgCBzQgED3A1FJQAJA6AIAgQANAxASAlQAWArAgAfQAkAhApAMQA7ARBCgbQA6gXAzgzQBFhFAfhWQAZhFADhjIAAiuIAAhcQAAg1gHglQgMhDglhJQgbg3gzhJIgagnQgOgXgGgTQgGgRgFgjQgFgjgGgSQgTg4g4geQglgUgkAAQgVAAgUAGg");
	this.shape_1.setTransform(134.4501,121.7117);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(82.3,13.5,104.3,216.5);


(lib.eggs3_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// bottom
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#C0B7AE").s().p("AHICRQgogBhIgIQgIAAgEgDQgGgDgEgMQgdhIgJglIgOhWQgGgmgJgbIAkgBIBfgBIDnACIAGAAIAeAAIAAgBIAVAAIAAAAIgCAMIgBADIgDARIgBAAIgNA9QgVBjgNAoQgKAfgOAJQgKAIgTACQgnAHgwAAIgYgBgAhmCKQgSgBgKgEQgSgIgLgXQgGgNgFgdQgRhcgbhgIgFgOIAyABQD6AGB/gFIACAAIACAFIgCAJQgXCAgvBiQgKAVgKAHQgJAGgVACQg4AFg2AAQgpAAgpgDgApBCGQgTgCgIgFQgIgHgHgPIgshkQgTgpgHgZQgLgmADgfIAAgKIADAAQAfABAqgBIBKgDQBlgDC6ADIgDAKQgJAlgPAtIgeBQQgRAtgLAZQgJAVgJAHQgKAHgXACQgpADgpAAQgyAAgxgFgAkMAQQARgtALgkIAFARQAKAkAGAbIgKgBIgTACgADeAAIAMgtIAJA2IABAFIgaAAIAEgOgAK6g5IABACIgCAFIgGAZg");
	this.shape.setTransform(126.2144,171.5221);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AHLC6QgkgChIgGQgZgCgMgIQgMgJgKgbQgSgsgKgiIgDAAIgNAAQgQAAgLADIgKABQgMAggOAcQgQAigSALQgSALgmADQg2AEg1ABQgxABgggDQgngEgWgOQgbgSgNgqQgFgPgEgVIgCgPQgHAEgQABIgiABIgNgBQgUA1gJARQgNAagOAKQgOAKghADQgqAFgqAAQgpAAhBgEQgTgCgKgCQgQgEgKgIQgMgKgMgaQgZg4gbhBQgUgtgFgaQgFgXAAgvQAAgQAEgIIACgEIACgGQAFgIATAAIBRgCQDzgEBiABQBTABCmAFIBmABQBTAAA/gDIACAAQADgCADAAQAFgBAEACIA/gCIBMgBID+ACIAGAAIBEAAIABAAIABAAIAIACIAGAEIAEAFIAAABIAAABIADAKIABABIgBADIgBAGQgBAHgFAMIgBADIAAADIgCAOIgEAUIAAADIgDAKIgFAWIAAgCIgHAgIgYBdIgKAnIgDAIQgPAkgVAPQgTANgpAFQggADglAAIgnAAgAEsiPIglABQAJAbAGAmIAPBWQAJAlAdBIQAEAMAGADQAEADAIAAQBIAIAnABQA+ACAxgIQATgCALgIQAOgJAKgfQAMgoAWhjIANg9IABAAIADgRIABgDIABgMIAAAAIgUAAIgBABIgdAAIgGgBIjogBIheABgAjOiAQAbBgASBcQAFAdAGANQAKAXATAIQAJAEATABQBeAIBhgKQAVgCAJgGQALgHAKgVQAvhiAXiAIACgKIgCgEIgCAAQh/AFj6gGIgygCIAEAPgAqxiCQgCAfALAmQAHAZASApIAtBkQAHAPAIAHQAHAFAUACQBaAJBagHQAXgCAKgHQAKgHAIgVQAMgZARgtIAdhQQAQgtAIglIADgKQi5gEhmAEIhJADQgrABgfgBIgCgBIgBALgAkEAQIAVAAIATgCIAJABQgFgbgLgkIgEgRQgMAjgRAugADmAAIgEAOIAaAAIgBgFIgIg2IgNAtg");
	this.shape_1.setTransform(125.3625,171.5479);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// eggs
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#000000").ss(2,1,1).p("ADfAAQAAB7hCBXQhBBYhcAAQhbAAhChYQhBhXAAh7QAAh6BBhXQBChYBbAAQBcAABBBYQBCBXAAB6g");
	this.shape_2.setTransform(174.1894,137.9263,1.0109,1.0248);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#DA905F").s().p("AicDSQhBhXAAh7QAAh6BBhYQBBhWBbAAQBcAABBBWQBBBYABB6QgBB7hBBXQhBBYhcAAQhbAAhBhYg");
	this.shape_3.setTransform(174.1894,137.9263,1.0109,1.0248);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#000000").ss(2,1,1).p("ADfAAQAAB7hCBXQhBBYhcAAQhbAAhChYQhBhXAAh7QAAh6BBhXQBChYBbAAQBcAABBBYQBCBXAAB6g");
	this.shape_4.setTransform(124.9394,136.4763,1.0109,1.0248);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#DA905F").s().p("AicDSQhBhXAAh7QAAh6BBhYQBBhWBbAAQBcAABBBWQBBBYABB6QgBB7hBBXQhBBYhcAAQhbAAhBhYg");
	this.shape_5.setTransform(124.9394,136.4763,1.0109,1.0248);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("#000000").ss(2,1,1).p("ADfAAQAAB7hCBXQhBBYhcAAQhbAAhChYQhBhXAAh7QAAh6BBhXQBChYBbAAQBcAABBBYQBCBXAAB6g");
	this.shape_6.setTransform(77.5894,135.7763,1.0109,1.0248);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#DA905F").s().p("AicDSQhBhXAAh7QAAh6BBhYQBBhWBbAAQBcAABBBWQBBBYABB6QgBB7hBBXQhBBYhcAAQhbAAhBhYg");
	this.shape_7.setTransform(77.5894,135.7763,1.0109,1.0248);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2}]}).wait(1));

	// top
	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#C0B7AE").s().p("AGnGiQhkgFgygBQgpgBhDACIhhADIgLAAIoUgHQhDgBghgEIgSgCIgGgFQgugrgFgtQgBgLAEgoQACgYgBgiIAAh5IgBgFIABgCQAGixAAiOIACgrQACgYAFgSQAHgWANgQQAOgSATgIIABAAIAKgDQA3gRBJgCQAlgBBfAEQCQAHCRgEQA+gBB/gEIBKgBID+AAQAYABAKABQATADAMAIQAMAHARAUQAgAnAIAXQAGAUABAkQACBCABBBQAABegDBdQgBARADAKIAGBeQAEA+gBAYQgBAwgLAkQgHATgHAKQgKAOgVAJIgPAHIgLAGQgqAFg3AAIgwgBg");
	this.shape_8.setTransform(126.2417,110.7592);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#000000").s().p("AGPHKQh5gGgnAAIhfAEQgrABgrgBIn5gFQhcgBgugFIgEAAQgFACgFAAQgJgBgMgMQgigfgQgeQgVglAAgmIADgjQACgRAAgxIAAh2IAAgFIAAgGQAHi6gBhdIAAg0QABgdADgWQAKg7AggiQASgTAXgKQAKgFAJAAQA3gQBKgCQAkgBBpAFQCKAGCJgDQA+gBB/gFIBWgBIAAAAIECABQAZAAALABQAUACAPAHQAXALAeAlQAiApAKAcQAHATACAZQABAPAAAfIAAEqQACAGAAAKIAHCMQAEBUgNA2QgKAmgRAUQgQASgpATIgDABIgLAEQgJAFgQABQghADgtAAQglAAgtgCgAESGcQAyABBjAFQBWADA7gHIALgGIAPgHQAVgJALgOQAHgKAHgTQALgkABgwQAAgYgEg+IgFheQgDgKAAgRQAEhdgBheQAAhBgDhCQgBgkgGgUQgIgXgfgnQgSgUgLgHQgNgIgTgDQgKgBgXgBIj+AAIhLABQh+AEg/ABQiRAEiQgHQhegEglABQhKACg3ARIgKADIgBAAQgTAIgOASQgNAQgGAWQgGASgCAYIgBArQgBCOgGCxIAAACIAAAFIAAB5QABAigCAYQgDAoABALQAEAtAvArIAFAFIASACQAhAEBDABIIVAHIAKAAIBigDIBNgBIAfAAg");
	this.shape_9.setTransform(126.1823,110.7638);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_9},{t:this.shape_8}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(52.4,64.8,146,125.39999999999999);


(lib.eggs2_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// bottom
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#C0B7AE").s().p("AHICRQgogBhIgIQgIAAgEgDQgGgDgEgMQgdhIgJglIgOhWQgGgmgJgbIAkgBIBfgBIDnACIAGAAIAeAAIAAgBIAVAAIAAAAIgCAMIgBADIgDARIgBAAIgNA9QgVBjgNAoQgKAfgOAJQgKAIgTACQgnAHgwAAIgYgBgAhmCKQgSgBgKgEQgSgIgLgXQgGgNgFgdQgRhcgbhgIgFgOIAyABQD6AGB/gFIACAAIACAFIgCAJQgXCAgvBiQgKAVgKAHQgJAGgVACQg4AFg2AAQgpAAgpgDgApBCGQgTgCgIgFQgIgHgHgPIgshkQgTgpgHgZQgLgmADgfIAAgKIADAAQAfABAqgBIBKgDQBlgDC6ADIgDAKQgJAlgPAtIgeBQQgRAtgLAZQgJAVgJAHQgKAHgXACQgpADgpAAQgyAAgxgFgAkMAQQARgtALgkIAFARQAKAkAGAbIgKgBIgTACgADeAAIAMgtIAJA2IABAFIgaAAIAEgOgAK6g5IABACIgCAFIgGAZg");
	this.shape.setTransform(126.2144,171.5221);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AHLC6QgkgChIgGQgZgCgMgIQgMgJgKgbQgSgsgKgiIgDAAIgNAAQgQAAgLADIgKABQgMAggOAcQgQAigSALQgSALgmADQg2AEg1ABQgxABgggDQgngEgWgOQgbgSgNgqQgFgPgEgVIgCgPQgHAEgQABIgiABIgNgBQgUA1gJARQgNAagOAKQgOAKghADQgqAFgqAAQgpAAhBgEQgTgCgKgCQgQgEgKgIQgMgKgMgaQgZg4gbhBQgUgtgFgaQgFgXAAgvQAAgQAEgIIACgEIACgGQAFgIATAAIBRgCQDzgEBiABQBTABCmAFQCTADBlgFIACAAQADgCADAAQAFgBAEACIA/gCIBMgBID+ACIAGAAIBEAAIABAAIABAAIAIACIAGAEIAEAFIAAABIAAABIADAKIABABIgBADIgBAGQgBAHgFAMIgBADIAAADIgCAOIgEAUIAAADIgDAKIgFAWIAAgCIgHAgIgYBdIgKAnIgDAIQgPAkgVAPQgTANgpAFQggADglAAIgnAAgAEsiPIglABQAJAbAGAmIAPBWQAJAlAdBIQAEAMAGADQAEADAIAAQBIAIAnABQA+ACAxgIQATgCALgIQAOgJAKgfQAMgoAWhjIANg9IABAAIADgRIABgDIABgMIAAAAIgUAAIgBABIgdAAIgGgBIjogBIheABgAjOiAQAbBgASBcQAFAdAGANQAKAXATAIQAJAEATABQBeAIBhgKQAVgCAJgGQALgHAKgVQAvhiAXiAIACgKIgCgEIgCAAQh/AFj6gGIgygCIAEAPgAqxiCQgCAfALAmQAHAZASApIAtBkQAHAPAIAHQAHAFAUACQBaAJBagHQAXgCAKgHQAKgHAIgVQAMgZARgtIAdhQQAQgtAIglIADgKQi5gEhmAEIhJADQgrABgfgBIgCgBIgBALgAkEAQIAVAAIATgCIAJABQgFgbgLgkIgEgRQgMAjgRAugADmAAIgEAOIAaAAIgBgFIgIg2IgNAtg");
	this.shape_1.setTransform(125.3625,171.5479);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// eggs
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#000000").ss(2,1,1).p("ADfAAQAAB7hCBXQhBBYhcAAQhbAAhChYQhBhXAAh7QAAh6BBhXQBChYBbAAQBcAABBBYQBCBXAAB6g");
	this.shape_2.setTransform(126.6894,136.4763,1.0109,1.0248);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#DA905F").s().p("AicDSQhBhXAAh7QAAh6BBhYQBBhWBbAAQBcAABBBWQBBBYABB6QgBB7hBBXQhBBYhcAAQhbAAhBhYg");
	this.shape_3.setTransform(126.6894,136.4763,1.0109,1.0248);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#000000").ss(2,1,1).p("ADfAAQAAB7hCBXQhBBYhcAAQhbAAhChYQhBhXAAh7QAAh6BBhXQBChYBbAAQBcAABBBYQBCBXAAB6g");
	this.shape_4.setTransform(77.5894,135.7763,1.0109,1.0248);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#DA905F").s().p("AicDSQhBhXAAh7QAAh6BBhYQBBhWBbAAQBcAABBBWQBBBYABB6QgBB7hBBXQhBBYhcAAQhbAAhBhYg");
	this.shape_5.setTransform(77.5894,135.7763,1.0109,1.0248);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2}]}).wait(1));

	// top
	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#C0B7AE").s().p("AGnGiQhkgFgygBQgpgBhDACIhsADIoUgHQhDgBghgEIgSgCIgGgFQgugrgFgtQgBgLAEgoQACgYgBgiIAAh5IgBgFIABgCQAGixAAiOIACgrQACgYAFgSQAHgWANgQQAOgSATgIIABAAIAKgDQA3gRBJgCQAlgBBfAEQCQAHCRgEQA+gBB/gEIBKgBID+AAQAYABAKABQATADAMAIQAMAHARAUQAgAnAIAXQAGAUABAkQAGCggGCeQgBARADAKIAGBeQAEA+gBAYQgBAwgLAkQgHATgHAKQgKAOgVAJIgPAHIgLAGQgqAFg3AAIgwgBg");
	this.shape_6.setTransform(126.2417,110.7592);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#000000").s().p("AGPHKQh5gGgnAAIhfAEQgrABgrgBIn5gFQhcgBgugFIgEAAQgFACgFAAQgJgBgMgMQgigfgQgeQgVglAAgmIADgjQACgRAAgxIAAh2IAAgFIAAgGQAHi6gBhdIAAg0QABgdADgWQAKg7AggiQASgTAXgKQAKgFAJAAQA3gQBKgCQAkgBBpAFQCKAGCJgDQA+gBB/gFIBWgBIAAAAIECABQAZAAALABQAUACAPAHQAXALAeAlQAiApAKAcQAHATACAZQABAPAAAfIAAEqQACAGAAAKIAHCMQAEBUgNA2QgKAmgRAUQgQASgpATQgIAEgGABQgJAFgQABQghADgtAAQglAAgtgCgAESGcQAyABBjAFQBWADA7gHIALgGIAPgHQAVgJALgOQAHgKAHgTQALgkABgwQAAgYgEg+IgFheQgDgKAAgRQAGiegGigQgBgkgGgUQgIgXgfgnQgSgUgLgHQgNgIgTgDQgKgBgXgBIj+AAIhLABQh+AEg/ABQiRAEiQgHQhegEglABQhKACg3ARIgKADIgBAAQgTAIgOASQgNAQgGAWQgGASgCAYIgBArQgBCOgGCxIAAACIAAAFIAAB5QABAigCAYQgDAoABALQAEAtAvArIAFAFIASACQAhAEBDABIIVAHIBsgDIBNgBIAfAAg");
	this.shape_7.setTransform(126.1823,110.7638);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(52.4,64.8,146,125.39999999999999);


(lib.eggs1_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// bottom
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#C0B7AE").s().p("AHICRQgogBhIgIQgIAAgEgDQgGgDgEgMQgdhIgJglIgOhWQgGgmgJgbIAkgBIBfgBIDnACIAGAAIAeAAIAAgBIAVAAIAAAAIgCAMIgBADIgDARIgBAAIgNA9QgVBjgNAoQgKAfgOAJQgKAIgTACQgnAHgwAAIgYgBgAhmCKQgSgBgKgEQgSgIgLgXQgGgNgFgdQgRhcgbhgIgFgOIAyABQD6AGB/gFIACAAIACAFIgCAJQgXCAgvBiQgKAVgKAHQgJAGgVACQg4AFg2AAQgpAAgpgDgApBCGQgTgCgIgFQgIgHgHgPIgshkQgTgpgHgZQgLgmADgfIAAgKIADAAQAfABAqgBIBKgDQBlgDC6ADIgDAKQgJAlgPAtIgeBQQgRAtgLAZQgJAVgJAHQgKAHgXACQgpADgpAAQgyAAgxgFgAkMAQQARgtALgkIAFARQAKAkAGAbIgKgBIgTACgADeAAIAMgtIAJA2IABAFIgaAAIAEgOgAK6g5IABACIgCAFIgGAZg");
	this.shape.setTransform(126.2144,171.5221);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AHLC6QgkgChIgGQgZgCgMgIQgMgJgKgbQgSgsgKgiIgDAAIgNAAQgQAAgLADIgKABQgMAggOAcQgQAigSALQgSALgmADQg2AEg1ABQgxABgggDQgngEgWgOQgbgSgNgqQgFgPgEgVIgCgPQgHAEgQABIgiABIgNgBQgUA1gJARQgNAagOAKQgOAKghADQgqAFgqAAQgpAAhBgEQgTgCgKgCQgQgEgKgIQgMgKgMgaQgZg4gbhBQgUgtgFgaQgFgXAAgvQAAgQAEgIIACgEIACgGQAFgIATAAIBRgCQDzgEBiABQBTABCmAFQCTADBlgFIACAAQADgCADAAQAFgBAEACIA/gCIBMgBID+ACIAGAAIBEAAIABAAIABAAIAIACIAGAEIAEAFIAAABIAAABIADAKIABABIgBADIgBAGQgBAHgFAMIgBADIAAADIgCAOIgEAUIAAADIgDAKIgFAWIAAgCIgHAgIgYBdIgKAnIgDAIQgPAkgVAPQgTANgpAFQggADglAAIgnAAgAEsiPIglABQAJAbAGAmIAPBWQAJAlAdBIQAEAMAGADQAEADAIAAQBIAIAnABQA+ACAxgIQATgCALgIQAOgJAKgfQAMgoAWhjIANg9IABAAIADgRIABgDIABgMIAAAAIgUAAIgBABIgdAAIgGgBIjogBIheABgAjOiAQAbBgASBcQAFAdAGANQAKAXATAIQAJAEATABQBeAIBhgKQAVgCAJgGQALgHAKgVQAvhiAXiAIACgKIgCgEIgCAAQh/AFj6gGIgygCIAEAPgAqxiCQgCAfALAmQAHAZASApIAtBkQAHAPAIAHQAHAFAUACQBaAJBagHQAXgCAKgHQAKgHAIgVQAMgZARgtIAdhQQAQgtAIglIADgKQi5gEhmAEIhJADQgrABgfgBIgCgBIgBALgAkEAQIAVAAIATgCIAJABQgFgbgLgkIgEgRQgMAjgRAugADmAAIgEAOIAaAAIgBgFIgIg2IgNAtg");
	this.shape_1.setTransform(125.3625,171.5479);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// eggs
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#252525").ss(2,1,1).p("ADfAAQAAB7hCBXQhBBYhcAAQhbAAhChYQhBhXAAh7QAAh6BBhXQBChYBbAAQBcAABBBYQBCBXAAB6g");
	this.shape_2.setTransform(77.5894,135.7763,1.0109,1.0248);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#DA905F").s().p("AicDSQhBhXAAh7QAAh6BBhYQBBhWBbAAQBcAABBBWQBBBYABB6QgBB7hBBXQhBBYhcAAQhbAAhBhYg");
	this.shape_3.setTransform(77.5894,135.7763,1.0109,1.0248);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2}]}).wait(1));

	// top
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#C0B7AE").s().p("AGnGiQhkgFgygBQgpgBhDACIhsADIoUgHQhDgBghgEIgSgCIgGgFQgugrgFgtQgBgLAEgoQACgYgBgiIAAh5IgBgFIABgCQAGixAAiOIACgrQACgYAFgSQAHgWANgQQAOgSATgIIABAAIAKgDQA3gRBJgCQAlgBBfAEQCQAHCRgEQA+gBB/gEIBKgBID+AAQAYABAKABQATADAMAIQAMAHARAUQAgAnAIAXQAGAUABAkQAGCggGCeQgBARADAKIAGBeQAEA+gBAYQgBAwgLAkQgHATgHAKQgKAOgVAJIgPAHIgLAGQgqAFg3AAIgwgBg");
	this.shape_4.setTransform(126.2417,110.7592);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#000000").s().p("AGPHKQh5gGgnAAIhfAEQgrABgrgBIn5gFQhcgBgugFIgEAAQgFACgFAAQgJgBgMgMQgigfgQgeQgVglAAgmIADgjQACgRAAgxIAAh2IAAgFIAAgGQAHi6gBhdIAAg0QABgdADgWQAKg7AggiQASgTAXgKQAKgFAJAAQA3gQBKgCQAkgBBpAFQCKAGCJgDQA+gBB/gFIBWgBIAAAAIECABQAZAAALABQAUACAPAHQAXALAeAlQAiApAKAcQAHATACAZQABAPAAAfIAAEqQACAGAAAKIAHCMQAEBUgNA2QgKAmgRAUQgQASgpATQgIAEgGABQgJAFgQABQghADgtAAQglAAgtgCgAESGcQAyABBjAFQBWADA7gHIALgGIAPgHQAVgJALgOQAHgKAHgTQALgkABgwQAAgYgEg+IgFheQgDgKAAgRQAGiegGigQgBgkgGgUQgIgXgfgnQgSgUgLgHQgNgIgTgDQgKgBgXgBIj+AAIhLABQh+AEg/ABQiRAEiQgHQhegEglABQhKACg3ARIgKADIgBAAQgTAIgOASQgNAQgGAWQgGASgCAYIgBArQgBCOgGCxIAAACIAAAFIAAB5QABAigCAYQgDAoABALQAEAtAvArIAFAFIASACQAhAEBDABIIVAHIBsgDIBNgBIAfAAg");
	this.shape_5.setTransform(126.1823,110.7638);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(52.4,64.8,146,125.39999999999999);


(lib.eggcarton_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AHLJyQgkgBhIgHQgZgCgMgHQgMgKgKgaQgSgtgKghIgDAAIgNAAQgQAAgLACIgKACQgMAggOAcQgQAhgSAMQgSALgmADQg2AEg1AAQgxABgggDQgngDgWgPQgbgRgNgqQgFgPgEgVIgCgPQgIAEgPABIgiABIgNgBQgUA0gJASQgNAagOAJQgOALghADQgqAEgqAAQgpABhBgFQgTgBgKgDQgQgDgKgJQgMgJgMgaQgZg5gbhAQgUgvgFgaQgFgXAAguQAAgRAEgHIACgFIACgFQAFgJATAAIBLgBQgagbgOgZQgVglAAgmIADgjQACgRAAgxIAAh1IAAgFIAAgGQAHi7gBhdIAAg0QABgdADgWQAKg7AggiQASgTAXgKQAKgFAJAAQA3gQBKgCQAkgBBpAFQCKAGCJgDQA+gBB/gFIBWgBIECABQAZAAALABQAUACAPAHQAXALAeAlQAiApAKAcQAHATACAZQABAPAAAfIAAErQACAGAAAKIAHCLQAEBUgNA2QgKAmgRAUQgHAHgKAHIA8AAIABAAIABABIAIABIAGAEIAEAFIAAABIAAABIADAKIABABIgBADIgBAHQgBAGgFANIgBADIAAACIgCAOIgEAVIAAADIgDAKIgFAWIAAgCIgHAgIgYBeIgKAmIgDAJQgPAkgVAPQgTANgpAFQggADglAAIgngBgAEsEoIglACQAJAaAGAmIAPBXQAJAmAdBIQAEALAGADQAEADAIAAQBIAIAnACQA+ACAxgIQATgDALgHQAOgKAKgeQAMgoAWhlIANg8IABAAIADgRIABgDIABgMIgUAAIgBAAIgdAAIgGAAIjogBIheAAgAjOE3QAbBhASBcQAFAdAGANQAKAYATAHQAJAFATABQBeAHBhgKQAVgCAJgGQALgGAKgVQAvhiAXiCIACgJIgCgFIgCAAQh/AFj6gGIgygBIAEAOgAqxE1QgCAgALAmQAHAZASAqIAtBjQAHAQAIAGQAHAGAUACQBaAJBagIQAXgCAKgHQAKgHAIgUQAMgaARgtIAdhQQAQguAIgkIADgLQi5gDhmAEIhJACQgrACgfgCIgCAAIgBAKgAkEHJIAVAAIATgCIAJABQgGgcgKglIgEgQQgMAjgRAvgADmG5IgEAOIAagBIgBgFIgIg2QgGAZgHAVgAEaD1QAyABBjAFQBWADA8gHQAEgDAGgDIAPgHQAVgJALgOQAHgKAHgTQALgkABgwQAAgYgEg+IgFhdQgDgKAAgRQAGifgGigQgBgkgGgUQgIgXgfgnQgSgUgLgHQgNgIgTgDQgKgBgXgBIj+AAIhLABQh+AEg/ABQiRAEiQgHQhegEglABQhKACg3ARIgKADIgBAAQgTAIgOASQgNAQgGAWQgGASgCAYIgBArQgBCOgGCyIAAACIAAAFIAAB4QABAigCAYQgDAoABALQAEAtAvArIAFAFIASACQAhAEBDABIIVAHIBsgDIBOgBIAeAAg");
	this.shape.setTransform(249.025,108.9826);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#C0B7AE").s().p("AHIJKQgogChIgIQgIAAgEgDQgGgDgEgLQgdhIgJgmIgOhXQgGgmgJgaIAkgCIBfAAIDnABIAGAAIAeAAIAAAAIAVAAIgCAMIgBADIgDARIgBAAIgNA8QgVBlgNAoQgKAegOAKQgKAHgTADQgnAGgwAAIgYAAgAhmJDQgSgBgKgFQgSgHgLgYQgGgNgFgdQgRhcgbhhIgFgOIAyABQD6AGB/gFIACAAIACAFIgCAJQgXCCgvBiQgKAVgKAGQgJAGgVACQg4AGg2AAQgpAAgpgDgApBI/QgTgCgIgGQgIgGgHgQIgshjQgTgqgHgZQgLgmADggIAAgKIADAAQAfACAqgCIBKgCQBlgEC6ADIgDALQgJAkgPAuIgeBQQgRAtgLAaQgJAUgJAHQgKAHgXACQgpAEgpAAQgyAAgxgFgAkMHJQARgvALgjIAFAQQAKAlAGAcIgKgBIgTACgADeG5QAGgVAGgZIAJA2IABAFIgaABIAEgOgAK6F+IABACIgCAFIgGAZgAGnD7QhkgFgygBQgpgBhDACIhsADIoUgHQhDgBghgEIgSgCIgGgFQgugrgFgtQgBgLAEgoQACgYgBgiIAAh4IAAgFIAAgCQAGiyAAiOIACgrQACgYAFgSQAHgWANgQQAOgSATgIIABAAIAKgDQA3gRBJgCQAlgBBfAEQCQAHCRgEQA+gBB/gEIBKgBID+AAQAYABAKABQATADAMAIQAMAHARAUQAgAnAIAXQAGAUABAkQAGCggGCfQgBARADAKIAGBdQAEA+gBAYQgBAwgLAkQgHATgHAKQgKAOgVAJIgPAHQgHADgEADQgpAFg3AAIgxgBg");
	this.shape_1.setTransform(249.8769,108.9609);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(176.1,46.3,145.9,125.39999999999999);


(lib.egg_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(1,1,1).p("ADfAAQAAB7hCBXQhBBYhcAAQhbAAhChYQhBhXAAh7QAAh6BBhXQBChYBbAAQBcAABBBYQBCBXAAB6g");
	this.shape.setTransform(9.4909,12.8673,0.4266,0.4325);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#DA905F").s().p("AicDSQhBhXAAh7QAAh6BBhYQBBhWBbAAQBcAABBBWQBBBYABB6QgBB7hBBXQhBBYhcAAQhbAAhBhYg");
	this.shape_1.setTransform(9.4909,12.8673,0.4266,0.4325);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,21,27.8);


(lib.brokenegg2_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(1,1,1).p("AAHhQQAugVAtAJQAvAKARAkQARAkgWApQgRAhghAVQgKAGgKAFAhVBfQgvgVgWgpQgYgpARgkQAQglAvgKQAqgKAtAS");
	this.shape.setTransform(29.9925,13.3275);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#DA905F").s().p("ABVBdIgBgCIgEgDIgUgNQgGgEgBgFQgBgCABgGIAHgYQACgFgBgEQgBgEgGgEIgIgGIgSgLQAAgJADgKIADgHQACgEAAgDQgBgEgIgDIgHgDIgGgDIgEgCIgBgGIAAgKIAAgBQAAgEgBgFIgBgGQAugVAtAIQAvAKARAkQARAkgWApQgRAhghAVIgUALIgBABIgBgDgAiaAhQgYgpARglQAQgkAvgLQAqgJAtARIAAAEIABABIAAABIADACIgCABQgDADgIAEQgGADgBADIgBADIgBADIAAAEIACAFQABAEgCAEIABAGIgDABIgJADQgFABgDADIgOAJIgBACIgCAEIABAHIAHAVIABAGIAAACIgEACQgPAGgMAKIgDAFIgBACIAAACIACAIIABAHIACARIAAAIIAAACQgvgWgWgogAhOA2IgBgCIADgBQgBAAAAABQAAAAgBAAQAAABAAABQAAAAAAABIABABIABAFQgBAAAAAAQAAABABAAQAAAAAAAAQAAAAABAAIAAACIAAACIABABIgBAHIABACIgBABQgBgNgCgKgAhCA5IAAAAIAAABgAhBAqIAIgEIgBABIgBABIgGADIgGAEIgCABIgBABIgBABgAgwAKIgBgDIACABIAAABIABADIAAAAIAAACIgCgEgAgxAHIAAgBIABAAIgBABIAAAAgAgxAEIAAAAIAAABIAAgBgAgyACIAAAAIABABIgBgBgAgogBIABAAIgBABIAAgBgAg0gFIAAgEIABAAIgBABIABADgAgqgQIgBABIgCABIADgCgAgegVIgBABIgCAAIgJAEIAMgFgAgTg2IAAgBIABgCIACAAIgBAAIAAAEIAAABIAAABgAgNg8IgBABIgCABIADgCg");
	this.shape_1.setTransform(29.9925,13.3525);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AhTBcIAAgEIAAgCIAAgIIgCgRIgBgHIgCgIIAAgCIABgCIADgFQAMgKAPgGIAEgCIAAgCIgBgGIgHgVIgBgHIACgEIABgCIAOgJQADgDAFgBIAJgDIADgBIgBgGQACgEgBgEIgCgFIAAgEIABgDIABgDQABgDAGgDQAIgEADgDIACgBIgDgCIAAgBIgBgBIAAgEIADgBIABgBIADAAIACABIAAAAQABAAABAAQAAAAABAAQAAABABAAQAAABABAAQAAAAABAAQAAAAABAAQAAABABAAQAAAAAAABIABABIABAGQABAFAAAEIAAABIAAAKIABAGIAEACIAGADIAHADQAIADABAEQAAADgCAEIgDAHQgDAKAAAKIASAKIAIAGQAGAEABAEQABAEgCAFIgHAYQgBAGABACQABAFAGAEIAUANIAEADIABACIABADIAAAEQgEACgDgBIgFgEIgSgNIgJgFIgCgCQgCgCgBgEIAAgEIAAgCIAJglQgGgFgVgNQgFgDgCgCIABgMIABgJQABgGACgDIACgEIgCgCIgNgFQgEgCgCgDQgCgCAAgDIAAAAQgCgEgBgEIAAgLIAAgDIAAABQgCADgGACIgDACIgDACIAAABIgCAAIgBACIAAABIACADIAAABIABAMIgBAHQgBAEgBABQgBABAAAAQgBABAAAAQAAAAgBAAQAAAAgBAAIgGADIgBAAIgMAFIgDACIgBABIgBAAIAAAAIgCABQAAAAAAABQgBAAAAAAQAAAAAAABQgBAAAAAAIAAABIgBAAIAAAEIABAAIgBABIABAAIAAAAIABABIAAABIAAABIgBABIABAAIAAADIABABIAAABIAAABIAAABIAAAAIABADIACAEQACALgBADIgBADIgCADIgIADIgBABIgIAEIgKAHIAAABIgBABIgDABIABACQACAKABANIAAAMQABAHgCADQgCACgDAAIgBAAQAAAAgBAAQAAAAAAAAQgBAAAAgBQAAAAgBgBg");
	this.shape_2.setTransform(29.7583,14.0792);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(12.1,2.8,35.8,21.099999999999998);


(lib.brokenegg1_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AAEARQgYgMgNgJIgDgCIgDABIgZAOIgFACQgEABgCgDQgBgEACgCQABgCAEgBIAegQQAEgCACABIAFADQAGAHAOAHIAQAHIASgRQAEgEADAAQADABAEADQAHAGAHADIADAAIADgCIAFgHIAGgDQAEAAABADQACADgEAEIgFAEIgGAHQgEAGgEgDIgDgDIgTgKIgRARIgEADIgDABQgCAAgDgCg");
	this.shape.setTransform(7.5944,13.225);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#000000").ss(1,1,1).p("ADfAAQAAB7hCBXQhBBYhcAAQhbAAhChYQhBhXAAh7QAAh6BBhXQBChYBbAAQBcAABBBYQBCBXAAB6g");
	this.shape_1.setTransform(9.4909,12.8673,0.4266,0.4325);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#DA905F").s().p("AicDSQhBhXAAh7QAAh6BBhYQBBhWBbAAQBcAABBBWQBBBYABB6QgBB7hBBXQhBBYhcAAQhbAAhBhYg");
	this.shape_2.setTransform(9.4909,12.8673,0.4266,0.4325);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,21,27.8);


(lib.fullcaketin_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#F4E7D7").s().p("AiMBAIg2gDIgpgDIjKgPIghgCQg5gDgngIIgDAAIgGAAIgFgBIgFAAIAAAAIgCgBIgDAAIgIgDIgBAAQgCABgGgCIgDgCIgCgBQgFgDgBgGQgBgHAGgJQADgFADgCIABAAIABgBQAFgEAHgCIAFgBQASgGAWgEQAlgHBXgHICGgJICIgIQFzgTFGAwIAQADQAOADAIADQAWAIAKAOQAEAFAAAEIABABQADAEgDAGQgDAEgGAEQgUANgmAIIh7ANQgyAEh4AAg");
	this.shape.setTransform(203.8752,66.1076);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#7F8082").s().p("AkeBRIh9gLIDKAPIhNgEgAolA5IAGAAIADABgAo6A3QgKgBgEgEIADABQAGACACAAIABgBIAIADIADABgAmegxQBqgVC6gJQCugJBzAHQDKALC/A9IAZAIIgQgCQlGgxlzATIiIAJIiGAJQhXAGglAIQgWADgSAFIgFABQA4glBhgUg");
	this.shape_1.setTransform(201.275,63.3887);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#323232").s().p("ABrFZQhogDhcgHIiHgNQhigJg5gLQgwgJgggPQgrgWgUghQgNgUgLgxQglisgbioQgNhUADgxQABgKgDgEIAAgFIgBgFQALAHAWACIBRAIQCaAPBOAFQBEADCJADQD6AEB+gBQB1gCBQgJQA6gGAngPQAQgHAKgIQgXDJgVDeQgDAqgEAWQgHAkgMAZQgTAoglAZQgXARgsAQQhSAdhWAJQguAFhDAAIgrAAg");
	this.shape_2.setTransform(203.8875,104.5485);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#000000").s().p("AA/G5QhwgDgugFQhWgLgrgEQhMgFgmgGQgygHgvgPQgtgPgWgTQgigagUgzQgMgggKg8Igtj0QgLg7gDggQgFgsACgmIgBgCQgDgYAAgOQABgVAHgPQALgXAigSQA0gfBIgRQA0gNBRgJQB7gNCQgFQBtgDBJADQA7AEBgALQBMAJAtAKQAaAGAkALIA+ASQAzAOAUAJQAnATAQAeQAFAHgCAHIgBAEQABAEAAAIIgsGzQgFAwgGAYQgIAogRAcQgbArg2AdQgoAVhAAQQgrALgnAHQg0AIhBABIgRAAIhkgBgApukGIABAFQACAFgBAJQgDAxANBUQAbCnAlCtQALAxANAUQAUAhArAWQAgAPAwAJQA5ALBiAJICHANQBcAHBoADQBgACA8gHQBWgJBSgdQAsgQAXgRQAlgZATgoQAMgZAHgkQAEgWADgqQAVjeAXjJQgKAJgQAGQgnAPg6AGQhQAJh1ACQh+ABj6gEQiJgDhEgDQhOgFiagPIhRgIQgWgCgLgHIABAFgAiUmeQi6AIhqAWQhhATg4AnQgHACgFAEIgBABIgBAAQgDACgDAFQgGAKABAHQABAGAFADIACABQAEAFAKAAIAJABIACABIAAAAIAFAAIAGABIAIAAQAnAIA5ADIAhACIB9ALIBNAEIApADIA2ADIGOACQB4AAAygEIB7gNQAmgIAUgNQAGgEADgEQADgGgDgEIgBgBQAAgEgEgGQgKgOgWgIQgIgDgOgDIgZgJQi/g8jKgMQgwgCg7AAQhRAAhlAFg");
	this.shape_3.setTransform(203.8642,96.9175);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(139.4,52.7,128.99999999999997,88.49999999999999);


(lib.emptycaketin_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#7F8082").s().p("Ah8BVQh/gDhAgEQgggChxgLIiKgOQgNgBgDgGQgEgGAJgPQAEgFABgFIAAgBIAGgFQA4gnBkgUQBpgWC6gIQCugJBzAGQDLAMC/A8QAmAMAUANQAPAKALAOIgFAJQgIAMgbAGQhMAQheAGQg/AEhtAAQiVAAjRgEg");
	this.shape.setTransform(204.126,63.7387);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#323232").s().p("ABrFZQhogDhcgHIiHgNQhigJg5gLQgwgJgggPQgrgWgUghQgNgUgLgxQglisgbioQgNhUADgxQABgKgDgEIAAgFIgBgFQALAHAWACIBRAIQCaAPBOAFQBEADCJADQD6AEB+gBQB1gCBQgJQA6gGAngPQAQgHAKgIQgXDJgVDeQgDAqgEAWQgHAkgMAZQgTAoglAZQgXARgsAQQhSAdhWAJQguAFhDAAIgrAAg");
	this.shape_1.setTransform(203.8875,104.5485);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AA/G5QhwgDgugFQhWgLgrgEQhMgFgmgGQgygHgvgPQgtgPgWgTQgigagUgzQgMgggKg8Igtj0QgLg7gDggQgFgsACgmIgBgCQgDgYAAgOQABgVAHgPQALgXAigSQA0gfBIgRQA0gNBRgJQB7gNCQgFQBtgDBJADQA7AEBgALQBMAJAtAKQAaAGAkALIA+ASQAzAOAUAJQAnATAQAeQAFAHgCAHIgBAEQABAEAAAIIgsGzQgFAwgGAYQgIAogRAcQgbArg2AdQgoAVhAAQQgrALgnAHQg0AIhBABIgRAAIhkgBgApukGIABAFQACAFgBAJQgDAxANBUQAbCnAlCtQALAxANAUQAUAhArAWQAgAPAwAJQA5ALBiAJICHANQBcAHBoADQBgACA8gHQBWgJBSgdQAsgQAXgRQAlgZATgoQAMgZAHgkQAEgWADgqQAVjeAXjJQgKAJgQAGQgnAPg6AGQhQAJh1ACQh+ABj6gEQiJgDhEgDQhOgFiagPIhRgIQgWgCgLgHIABAFgAiUmeQi6AIhqAWQhkAUg4AoIgGAFIAAABQAAAFgEAFQgJAPADAGQAEAGAMABICKAOQBxALAhACQA/AEB/ADQDRAECWAAQBsAAA/gEQBfgGBLgQQAbgGAIgMIAGgIQgLgPgPgKQgUgOgngMQi/g8jKgMQgwgCg7AAQhRAAhlAFg");
	this.shape_2.setTransform(203.8642,96.9175);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(139.4,52.7,128.99999999999997,88.49999999999999);


(lib.candle_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#9999FF").s().p("AAUCFIgUgBIgQgUIgEgDIgCgCIgBgEIABgXIAEACIAEAEQADAEAIAHIAQATIAFADQAFADgBAGIgBAEIAAABIAAAAgAghBdIAAAAIAAgFIAAAGgAAWBbQgDgBgEgFQgFgEgHgLIgFgJIgTgXIABgaQAFABAGAHIAJALIAGAJIABABIAFAFIAOAVIAGAHIAAAPIgCABQgCACgDAAIgDgBgAASAXIgFgLIgGgHIgGgHIgBgEIgIgQIgDgGIgHgHIAAgaIAAAAQADABAFAEIAHAHQAFAFACAEIAPAcIADAEQAGAGACAEIADAEIgBABIABAGIABALIgFADIgDAAQgFAAgDgEgAgcgtIAAAAIAAABgAAXgyQgCgBgEgFIgFgGIgFgIQgDgGgIgJQgKgJgHgJIgCgYIAAgEQAEgBADABIACABQAEACAFAKQAEAHAEAFIAHAIQAIAHAHALIAEAGIAFAGIAAADIAAADIAAAIIgBADIgEACIgBAAIgFgBgAgdg5IAAAAIABgBIAAAAIAAAFIgBgEg");
	this.shape.setTransform(79.425,6.0452);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#6249B2").s().p("AAQCFIABgEQABgGgFgDIgFgDIgQgUQgIgGgDgEIgEgEIgFgCIACgrIATAXIAGAJQAGALAFAFQADAFAEABQAEABAEgCIACgBIAAAFIAAAFIgHAcIAAADIgEACgAgHCEIgBAAIgEgBIgKgCIgHgEIABgDIABgOIAAgBIACACIAEAEIARATgAAUBDIgNgUIgFgGIgBgBIgGgIIgJgLQgGgIgFgBIABgUIABgQIAAgKIAHAGIADAGIAHARIACADIAGAIIAGAGIAEALQAFAGAGgBIAGgDIAAABIgBApQgCABABAFIAAABgAAZACQgCgEgGgFIgEgEIgNgdQgCgEgGgEIgIgHQgEgFgDAAIAAAAIgDgqQAHAIAKAKQAJAJACAFIAFAIIAFAGQAEAFACABQADACADgBIAEgBIAAAFIAAACIACACIgBAcIAAASIgBABgAAXhKIgDgGQgHgLgIgHIgGgHQgGgFgDgHQgFgLgEgCIgDgBIAEAAIALABQADABADgCIABgBIAaABIAAADQABAHABAbIABAZIAAACIgGgHg");
	this.shape_1.setTransform(79.95,5.975);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFCC33").s().p("AgSAnQgFgEABgHIACgLQABgHAMgVQAHgPACgKIABgFIACAFIALAZQAHASABAMQAAAMgHAHIgDADIgWAAIgFABIgFgDg");
	this.shape_2.setTransform(79.55,-12.325);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#D85986").s().p("AgaAzIgBgBIACAAIABABgAAbgyIABAAIAAAMIgBAcg");
	this.shape_3.setTransform(80.8875,14.9619);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#000000").s().p("AAaDFIgBgBIAAABIgFAAIgPgBQgMAAgEgBIgCgBIgBAAIgCgBIgMgCIgEgBIgEgEIgCgBIgBgEIABgDIABgBIAAgeIAAABIAAgGIAAgBIABgcIABgUIgBgDIAAgBIABAAIAAgKQgBgEACgEIACg0IAAgFIAAgDIAAgDIABABIAAgBIAAgBIAAgHIgBgEIAAAAIAAgFIgCgZQgCgdgBgNQAAgEACgCIAAAAIADgCIADgBQgFgGAAgKQAAgKAGgNIALgXQAGgLACgIIAAgDIAHgVQAAgCACgCQABgCADAAQACACAAAGIABAIIAFAOIADAHIAIARQAGAPABARQAAAFgBAHQgCAGgDAGIABAAIAGAAIAAABIACAAQAAAAAAAAQABAAAAABQAAAAABABQAAABAAABQADAIAAAMIAAAUIABAOIACACIAAAUIgBADIAAACIAAABIAAAGIAAABIAAABIgBA0IABADIAAAKQAAAFgCACIAAABIABAAIAAAKIgBAAIAAAoIAAASIgBANIgBAHIgBALQgBAIgBAEQAAAAgBABQAAABAAAAQAAABgBAAQAAAAAAABIgCAAIgDAAgAgbhNIAAAEIADAYIACAqIABAZIAAAKIgBARIgCAVIgBAaIgBAqIgBAXIABAEIAAAAIgBAPIgBADIAHADIALADIADAAIACABIACAAIATABIABAAIAAAAIAAgBIAAAAIAFgBIAAgDIAGgdIAAgEIAAgGIAAgPIAAgBQAAgFABgCIACgpIgBgBIgBgLIgBgGIABgBIACgBIAAgTIABgcIgCgDIgBgBIAAgGIABgCIAAgIIABgDIAAgDIAAgBIgCgZQAAgcgCgHIAAgDIgbAAIAAABQgDABgDgBIgLgBIgDABIgCgBIgFABgAAAimQgCALgHAOQgMAWgCAHIgCAMQAAAGAFAEIAEADIAGgBIAVABIAEgEQAGgGAAgMQAAgNgHgTIgMgZIgCgEIAAAEg");
	this.shape_4.setTransform(79.8,0.645);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(75.8,-19,8.100000000000009,39.4);


(lib.cakelayer2frosted_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#EDC699").s().p("AggC+QhDgEghgGIgpgKQgXgFgMgEIgbgJIgbgHQgPgDgkgOIhzguQgRgHgGgIQgGgIgCgRIgEghIgCgKIgEgjQgFgfgEgSQgHgmgBgOIAAgKIAKgFQAPgIAWgZQALgLAHAEQAEACACAIQAOAqASARQANAMARACQASADANgJQAFgDAHgIQAHgJAEgDQAJgHATgGQAPgFAHAGQAGAFABALIABADIAAAFQAEArAhAdQAMALAOAHQAWAKAbAAQALAAAJgDQAGgDAHgEIAHgGQAMgJALgNQAJgMARgbQASgWAVgBQAJAAAKAGQAJAFAEAKIADAIIADAGQANAXAMAKQAVAPAXgGQAYgHASgdQAKgQAPgiQAQgfAVgKQALgFAIACQAGACAKALQAXAgAdAgQAMANAJAEQAJAEAPAAQAVAAAMgHQALgHAKgQIAPgcQAFgIAFgCIAFgBIAFgBQAHABAIADIARAIQAMAGAMABQgDAGAAAKQgDAogFAoIgEAjIgCAHIgEAZQgEAOgHAJQgGAJgRALQgdAVgXAQQgaASgUALQgVAKgiALQhtAhhzAAQgnAAgwgEg");
	this.shape.setTransform(62.125,95.0828);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AAiGVQhHgCgrgEQgvgIgjgHIgSgEIgPgFIgPgCIgGgCIgqgLIgQgFQgRgIgWgHIgXgIIhNgfIgRgIIgGgBQgQgHgJgIIgBgBIgDgEIgCgDIgDgDIgFgWIgMhIIAAgCIgHguIgHgmQgEgVgBgQIAAgCQgIAAgJgDQgUgIgJgbQgGgPABgfQABgnAJhNQAGgqADgPQAFgTAFgOQAGgMAHgEQAsguBkgfQBigeBmgNIAvgGQAbgDATgFQALgDAFADIAVgCIAZgFIARgBIAkgCQAXgCANABQAHAAACACIABABIAJAAQDAAFB4AuQATAIAJAFQAGADAOAMIAbAZQAYAXAJAMQATAYAKAfQAIAYABAZIACAIQAHAigCA4QgBAfgDATQgEAagLAUQgJAQgLAFQgFACgGABIgBAEIgLBrIgLA5IgCACIgCAJIgFAMIgFAIQgLANgZATIgqAeIgEACIgBABIgKAGIgXAOQgZAMgoAPIgKAEIgVAFIgFACIAAAAIgBAAIgaACQgHABgKAEIgNAFQgZAEgbAEIgWACQgzAAgUABIgKAAIgDAAIgEAAgAm2AGQgXAYgOAIIgLAGIABAJQAAAOAIAmQAEATAEAeIAFAjIABAMIAFAhQACARAFAHQAGAIASAHIBzAuQAjAOAQAEIAaAGIAcAKQALAEAYAFIApAJQAhAHBDAEQAwADAnABQBzAABsghQAigLAVgLQAVgKAZgTQAYgPAdgWQAQgLAGgIQAHgJAEgOIAFgaIABgIIAFgjQAEgoADgoQABgKADgFQgMgCgMgFIgSgIQgIgEgGgBIgFABIgGABQgEACgGAJIgPAcQgJAQgLAHQgNAHgVAAQgPAAgIgEQgKgEgLgOQgdgggYgfQgJgMgHgCQgIgCgKAFQgVALgRAeQgPAjgJAQQgSAdgZAGQgXAHgUgPQgNgKgMgYIgDgGIgDgIQgEgJgKgGQgJgGgKABQgUAAgTAXQgQAagKANQgKAMgMAKIgIAFQgGAFgGACQgKADgLAAQgaABgWgLQgOgGgNgMQgggcgFgrIAAgGIAAgCQgBgMgGgFQgHgFgQAFQgTAFgJAIQgEADgHAIQgHAIgEADQgOAKgSgDQgRgDgNgMQgSgRgNgpQgCgJgFgBIgDgBQgGAAgIAIgAjsAXQAJAGAEAQIAEAVIAAAHQAHAbAUATQAXAWAfADQAPABAIgEQAKgEAJgJQAOgMAKgRIASgbQAUgZAfgDQALgBAJACQAVAHAQAhIABABIADAFIAEAKQAIAQAOAEQALADAMgFQALgFAHgKQAGgIAGgMIAJgWQAHgPAPgVQAYggAagDQAOgBAKAFQAGAEALALIAsA2QALAOAKAGQALAHANgCQANgBAJgIQAHgGAFgKIAJgTQAIgOAJgHQABgCADgCQAEgDAIAAQANAAAXALQAYAKAMABQAKABAFgDQAEgDAEgIQAKgSAFgZQACgRABgeQABgugEgZIgCgDQgCgDAAgMQgBg3gjgsQgMgPgSgQQgcgbgVgMQgLgGgYgJQhGgYhagLQg4gGhcgEIgHABQhGACg0AIIgeAEQgDABgDgBIgCgCIhbANQhRAMg3APQhJATg5AdQghARgNASIgJAKIgBAAQgFAIgCANQgKApgHBSIgEA0QgCAZAEAOQAFATAOAGQASAIAVgSIAPgOQAJgKAHgEQAKgHAKgBQAMAAAIAGQAHAGAFASQAEANAHAOQAJAPAHAFQAMAJAMgDQAHgBAGgGIAMgLQAVgWAegEIAKAAQAMAAAIAGg");
	this.shape_1.setTransform(62.0645,75.9203);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#D85986").s().p("Ai8GOIAAgBIAHABgAhLGBIgFgBQArAEBHADIAHAAIgmABQgfAAgvgHgAB6GFIAWgCQAbgDAZgFIgEACIgEABIgDABQgRACgPAEIgfAAgAECFtIAVgFQgPAGgLABIAFgCgAjeFkIgCAAIgigLIAqALIgGAAgAF5E8IAKgHIgFAEIgEAFIgCABIgWAKIAXgNgAmPElIgOgHIBNAfQgxgRgOgHgAGyEUQAZgTALgNIgCAEIgCADIgBACIAAABIgMAKIgEAEIgEABIgKAIIgMAIIgKAIQgHAGgJADIgFAEIAqgegAm5EUIgDgCIgKgEIgHgIQAJAIAQAHIgFgBgAiKCBQgfgDgXgWQgUgTgHgbIAAgHIgEgVQgEgQgJgGQgLgIgTADQgeAEgVAVIgMALQgGAGgHACQgMADgMgKQgHgFgJgPQgHgOgEgMQgFgTgHgGQgIgGgMAAQgKABgKAHQgHAFgJAJIgPAPQgVARgSgHQgOgHgFgSQgEgOACgaIAEg0QAHhSAKgpQACgNAFgHIABgBIAJgKQANgRAhgRQA5geBJgTQA3gOBRgNIBbgMIACABQADABADgBIAegEQA0gIBGgCIAHgBQBcAEA4AGQBaALBGAYQAYAJALAGQAVAMAcAbQASARAMAOQAjAsABA4QAAALACADIACAEQAEAZgBAtQgBAegCASQgFAZgKASQgEAHgEADQgFAEgKgCQgMgBgYgKQgXgKgNAAQgIAAgEACQgDACgBADQgJAGgIAPIgJASQgFALgHAFQgJAJgNABQgNABgLgHQgKgFgLgPIgsg1QgLgMgGgEQgKgFgOACQgaACgYAhQgPAUgHAPIgJAWQgGAMgGAIQgHAKgLAFQgMAFgLgDQgOgEgIgQIgEgKIgDgFIgBgBQgQghgVgGQgJgDgLACQgfACgUAaIgSAbQgKAQgOAMQgJAJgKAFQgGACgLAAIgGAAg");
	this.shape_2.setTransform(62.0508,77.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(6.3,35.4,111.60000000000001,81.80000000000001);


(lib.cakelayer2_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#EDC699").s().p("AhPF7QhGgLhigaQhOgWgsgVQg6gbgUgmQgHgOgIgfQgNgzgEgXQgHgpABgiQAAgMgFgDIgBAAQgHgmACgwQABgeAHg7QAEgnAGgWQAIghASgVQAUgXAlgOQANgFA3gQIAtgPQAcgJASgEQAggIAvgFIBRgHQAbgCA1gIQAxgGAgAAQAngBBMAHQBaAKAoAKQBVAWAlA2QARAZAMAsQARBDgBBUQgCA6gMBdQgBAMAEAEQgDAmgFAoQgFAjgHAQQgRAmg1AdQgoAWhIAXQhzAkhPAHQgaACgbAAQg2AAg+gJg");
	this.shape.setTransform(97.4589,58.815);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AhXGPQgxgHhggZQg/gQghgMQg0gTglgZQgggVgNgXQgIgPgGgXIgBgCIgBAAIgEgQIAAgCIAAAAQgThIgFhKIAAgEQgEgGgBgHQgKhLANh2QAFgqAIgYQAOgoAfgaQAYgTA1gTQBPgbBTgPQA7gLB2gNQBQgJAoAAQAoAABOAHQBHAGAiAHQBiAUAxA4QAhAlAOA6QALAsACBAQACBSgIBMIAAAHQgCA2gIBCIAAAHIABAAQgDAJgBAJIAAADIgBAAQgEAUgFANQgTAsg0AfQgVANgdALIg2AUQg8AUgiAJQhYAYhdAAQhBAAg7gKgABWmDQghAAgxAGQg1AIgbACIhQAHQgvAFghAIQgSAEgbAJIgtAPQg3AQgNAFQglAOgUAXQgSAVgJAhQgGAWgEAnQgGA7gBAeQgCAwAHAmIAAAAQAFADAAAMQgBAiAIApQAEAXAMAzQAJAfAGAOQAVAmA6AbQArAVBOAWQBiAaBGALQBcAOBOgHQBPgHBzgkQBHgXApgWQA0gdASgmQAHgQAFgjQAFgoADgmQgEgEABgMQAMhdABg6QAChUgRhDQgMgsgSgZQglg2hVgWQgngKhbgKQhHgGgmAAIgFAAg");
	this.shape_1.setTransform(97.4435,58.825);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(45.8,17.9,103.3,81.9);


(lib.cakelayer1frosted_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#EDC699").s().p("AgjD5QhIgGhCgOQgjgHhigZIhqgcQgfgJgegNQgXgJgLgLQgOgNgKgbQgRgqgMg7IgShpIgMg8IgBgDQAQgJAOgYQAMgWAIgGQAHgGAIgCQAKgCAGAFQAIAFAFAQIALAkIAHAeQAJAeASAPQAYAUAagIQAWgGARgcIANgYQAHgOAGgIQAUgbAZABIAAAAIADACQAFADAKgBQAMAAADABQAIADAFALQAIAOAFAWIAHAlQAEAPAGAHQAIAIANADQARAEARgHQARgGAKgOQAFgGAEgJIAHgRQAJgUAKgKQARgOAQAHQAMAFAFAQIAGAaQAFAeAUAwQAKAUADAEQAHAJANAFQAMAEANgBQAagCASgUQAKgMAJgTIANgiIAPghQAHgPAJgEQALgEAMAKQAGAGAIAPQAKARANAOQALANAKAEQAKAFAPgBQAXAAAQgMQALgIANgXIAYgsQAKgRADgDQAJgKAPgEQAOgFANAEQAJAEAMANIAsAuQAWAXANAFQARAIAiAAQAYAAANgEIgCAKIgEAYQgBAFABADIAAAEQgEAsgHAsQgCARgEAPQgEAMgKATQgOAdgKAMQgNAPgbAOIgsAYQgQALgJAEQgLAGgTAGQgrANhTAJQhuALhbAAQg2AAgugEg");
	this.shape.setTransform(101.775,58.5411);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#D85986").s().p("AAZEjQgLgBgIgGQgHgGgHgRQgTgtgGghQgDgVgDgGQgEgMgLgIQgKgJgNgDQgMgCgNAEQgNAEgJAJQgHAHgFALIgJAVQgMAbgPAIQgIAFgMAAQgJgBgEgDQgIgGgDgSQgGghgHgUQgKgegUgJQgFgCgIAAQgDgDgHgBQgYgDgXAKQgWAKgOAUQgFAIgHANIgKAWQgOAZgSACQgLACgMgHQgKgGgGgLQgFgIgEgNIgFgYQgFgXgKgYQgFgNgEgGQgNgQgUAAQgUAAgPAOQgIAIgKAQQgLAUgFAGQgGAGgGADQgFACgLgCQgLgDgFgEQgGgEgHgOQgSgggGgVQgJgfAFg7QADglAFgWQAHggAPgVQAIgMAYgXQAWgVANgHQAJgGAfgNIAWgIIAYgGIAAABIABgBIAJgCIAKgBIgBgCIAOgDIAOgCQAhgGA5gFQDjgTDfADQAvABCqAGQAtACAWACQAlAFA6ANIgDAAIAFACQAPADAUAHIAuARIAAABQAWAHAUALIAkAUQAPAKAGAFQAGAHAHAJQAQAXAFANQAGARgDAeQgEAwgIAjQgDASgGALQgHANgNAKIgOAJQgIAFgFAFQgQAQgBAkIgBAcQgBARgDALQgFAPgKAFQgFADgMABQgOACgRgBQgUgCgJgFQgKgFgMgNIgyg0QgQgQgIgDQgNgGgTACQgdAEgRASQgFAHgIAPIgQAeQgOAagMALQgTASgWgGQgJgEgKgJQgGgHgHgLIgMgTQgOgXgSgGQgIgCgLABQgJABgIAGQgHAFgGAOIgUAqIgHATIgIATQgMAWgQAIQgIAEgKAAIgCAAg");
	this.shape_1.setTransform(102.5607,26.157);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AikGzQgogHhJgUQhNgUgkgHIgjgIIgggNIgogRQgRgHgLgJQgVgQgQgvQgNgmgHgcQgHgcgJhAQgKg7gIggIgCgLQgUAAgSgPQgMgLgNgZQgSgkgEgfQgCgNABgjQACgxAFgdQAIgsAUgcQAMgRAbgZQAbgYAQgIQAHgEAQgFIAEgBIACgCQADgDAIgDQAogNA0gIQAfgFA/gHIAkgDIBIgEQCjgIBSgBQBvgBDhAKIArACQAoAEBNATQAvAMASAHQAPAGAJAFQAGAEACAEQAZALAZAQQAUANAGAGQAJAHAKAPQANARAFAMQANAfgIA3QgDAegGAeQgCASgGAOQgKAagbARQgRALgDAEQgHAJgBAQIgBAcQAAASgCAKQgCARgHALIgBAGIAAAFIgCAHIgHAmIAAABQABAEgBAJIgLBZIgGAfQgFARgNAbQgIARgJANQgKANgLAJQgMALgSALQgcAMgNAIIgcASQgNAIgUAFQgvAOhIAIQhUAKhUACIgpABQiAAAhmgUgAoVhFQgJABgHAGQgHAHgMAWQgOAXgQAJIAAACIANA8IASBpQALA8ARAqQAKAbAPAOQALAKAXAKQAeANAeAJIBqAcQBiAYAjAHQBCAOBIAGQB9ALCxgSQBSgIAsgOQATgFAKgGQAJgFAQgLIAtgXQAagOANgPQALgMAOgdQAJgTAEgNQAEgOADgSQAHgsADgtIABgDQgBgEAAgFIAEgYIACgKQgNAFgYAAQgiAAgQgIQgNgGgWgXIgsguQgMgMgKgDQgMgFgOAFQgQAFgIAIQgEAEgJARIgZArQgNAXgKAIQgQANgYAAQgOABgLgFQgKgFgLgNQgMgNgKgSQgJgPgFgFQgMgLgLAFQgJADgHAPIgPAiIgOAiQgIATgLALQgRAUgbADQgMABgNgFQgLgEgIgKQgEgEgKgUQgUgvgFgeIgFgbQgGgQgLgEQgQgGgRANQgLAJgIAVIgIAQQgEAKgFAGQgKAOgRAGQgRAGgQgEQgNgCgIgJQgGgGgEgPIgIgmQgFgWgHgNQgGgKgHgDQgEgCgLAAQgKABgGgDIgCgCIgBAAQgYAAgUAaQgGAHgIAPIgNAXQgQAdgXAGQgZAHgYgTQgTgQgIgdIgHgdIgLglQgFgQgIgFQgFgDgGAAIgFABgAhMgRQANADAKAJQAKAHAFAMQACAGAEAVQAFAhAUAtQAHARAHAGQAHAGAMABQAKAAAKgEQAQgIALgWIAJgTIAHgTIAUgqQAGgOAGgFQAIgGAKgBQAKgBAIACQASAGAPAXIAMATQAHALAGAHQAJAJAKAEQAVAGAUgSQALgLAOgaIAQgeQAIgOAGgHQAQgSAegEQASgCAOAGQAIADAPAQIAyAzQANANAJAFQAJAFAUACQASABAOgCQAMgBAFgDQAKgFAEgPQAEgLAAgRIABgbQABgkAQgQQAFgFAIgFIAOgJQAOgKAHgNQAGgLACgSQAIgkAEgwQADgegGgRQgEgNgRgXQgGgJgHgHQgFgFgQgKIgjgUQgVgLgVgIIgBAAIgtgRQgUgIgPgCIgFgCIADAAQg7gOglgEQgWgCgtgCQipgGgwgBQjegDjjATQg5AFghAGIgPACIgNADIAAACIgJABIgJACIgCABIAAgCIgYAHIgWAIQgeANgKAGQgNAHgVAVQgZAXgIAMQgPAVgHAgQgFAWgDAlQgFA8AJAfQAGAVASAgQAIAOAFAEQAFAEALADQAMACAFgCQAGgDAFgGQAFgGAMgUQAJgQAJgIQAPgOATAAQAUAAANAQQAFAGAFANQAJAYAFAXIAGAXQADANAFAIQAHALAKAGQALAHALgCQASgCAOgZIALgWQAGgMAGgIQANgUAXgKQAXgKAXADQAIABADADQAIAAAEACQAUAJALAeQAHATAFAhQADASAIAGQAEADAJABQAMAAAJgFQAOgIAMgbIAJgVQAGgLAHgGQAJgJANgEQAHgDAIAAIAKABg");
	this.shape_2.setTransform(102.5455,40.3955);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(32,-5,141.1,90.9);


(lib.cakelayer1_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#EDC699").s().p("AAWGsQiKgMibgYQg8gKgigKQgigLgngUQgZgNgsgaQgNgHgHgIQgKgKgHgWQgYhEgIgjQgGgagIg7QgFgqgGgaQABgEgCgGQgShZgEicQAAgWABgHQAEgpAjgcQARgNAUgGIAEgBIAZgEIAZgHIAxgOQAbgGBCgGQEBgWB2gCQBIgBAzACQCoAHClAqIACAAIAZAHQAHACAFAAIABAAIAdALQAWALAJAIQAHAGAMATQANAUAFAMQAHATABAaQAAAQgDAfIgMCCIAAAJIgCAFQgXB7gMCIQgDAjgDAOQgFAcgLATQgRAegsAcQhcA8iHANQgjAEgtAAQhFAAhcgJg");
	this.shape.setTransform(110.0036,65.3344);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("ABOHGQhEgFhDgHQhCgHh9gSQhMgLglgLQgkgLgogUQgcgNgtgaQgTgKgLgLQgMgMgMgdQgWg7gPhOQgJgtgLhUQgCgEAAgGQgQhWgFicQAAgZABgHQAEgrAiggQAfgeAtgHIAAAAIABABIBGgSQAigJAsgFQAagDA0gFQCugOBwgEQCcgECBANQA7AGAlAIQAdAGA6APIA6AKQANACADADIACABQAVAIAUAKQAQAIAIAHQAHAGANAUQAXAlAGAWQAEASgBAXQgBAygKBXIgEAkIgBAGIAAAFQAAAQgEAVIgJAlQgIAngGBNQgHBQgHAlQgIArgQAYQgNAVggAYQgtAggwAUQhLAehgAHQggADgmAAQgwAAg7gEgAAYmzQh1ACkCAWQhCAGgaAGIgyAOIgZAHIgZAEIgDABQgUAGgSANQgiAcgFApQgBAHAAAWQAECcATBZQABAGgBAEQAGAaAGAqQAHA7AGAaQAIAjAYBEQAIAWAJAKQAHAIANAHQAtAaAYANQAoAUAiALQAiAKA7AKQCcAYCKAMQCWAOBagJQCHgNBdg8QArgcASgeQAKgTAFgcQADgOADgjQANiIAXh7IABgFIAAgJIANiCQADgfgBgQQAAgagIgTQgFgMgMgUQgMgTgIgGQgIgIgWgLIgdgLIgCAAQgFAAgGgCIgagHIgCAAQikgqipgHIhNgBIguAAg");
	this.shape_1.setTransform(109.96,65.3131);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(45.5,19.6,129,91.5);


(lib.blur_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.1,1,1).p("EgqpgYwMBVTAAAMAAAAxhMhVTAAAg");
	this.shape.setTransform(327.975,150.525);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("EgqpAYxMAAAgxhMBVTAAAMAAAAxhg");
	this.shape_1.setTransform(327.975,150.525);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(54,-8.9,548,318.9);


(lib.background_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// front_counter
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8ED9EF").s().p("A40LlQiHgDlHgPQkogOimAAQh3gBkYAIQj/AHiPgCQgcAAgMgKQgJgJgGgUQgsiSAJjjQASj/gDh+QgBhbgPiGQgRiWgHhLQgKhlABhSMA9yAALMArbgAvIAEA3QAOCjAgDdQA4GFAIBMQAdEIgODLQiegGjtATQkIAaiEAIQhfAGi/AEIt9AXQn2ANkMAEQmqAFlXgFQjegEhvAAQixgBmaAMQkmAIjAAAIhmgBg");
	this.shape.setTransform(387.4517,385.5833);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#18264A").s().p("Eg0lAAiQACgiADggMA9DAALMAr/gAwQABAxAEAzMgkSAAQImOAJMg+tAAOIABgkg");
	this.shape_1.setTransform(380.725,307.125);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#5CB4C2").s().p("Eg0EgAUIAKglQAEgSABgOMA9BAALMArUgAvIAAAEQgDBkADBrMgk1AAQImOAJMg99AAPQAIhOAUhEg");
	this.shape_2.setTransform(380.8,290.375);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#000000").s().p("A4VOqQhpgCnPgUQldgNjcAEIkxAKQi2AGh8gGQgkgCgPgMQgTgNgIgrQgtjUAOjcIAHhgQAGg+ACgjQAGhzgPihIgdkWQgPigAHh3IADgmIgTAAIgPgJIAiAAQALh2AihhIgWgBIgPgIIAoAAIAAAAQAHgQAIACQAIABABANMA98gAPIGPgJMAkOgAQIADgHQAHgLAKADQAHADABAMIBqgBIgFAJIgMACIhZABIAAABQgHBhAFBzIBCAAIgFAIIgMACIgxAAQACAvADAxIABAGIBmgBIgFAJIgMACIhUABQAIBqAYDCIAfD3QAMBgAHAkIAOBFQAJArAEAZQAJA9AGBtQAJCwAAC7QAAAggLAMQgIAJgQACQgKACgSgBQiYgHjjATQj9AZh/AIQhKAEjDAGIyCAcQnFAKjjADQl6AFktgHIi1gEQhogChMABQhWAAkEAJQlNALj2AAIiQgBgEgnCANsQCnAAEoAOQFGAPCIADQDRADF6gKQGagMCxABQBvAADfAEQFWAFGrgFQEMgEH2gNIN8gXQDAgEBfgGQCEgIEHgaQDtgTCfAGQAOjLgdkIQgIhMg5mFQggjdgNijIgEg3MgrcAAvMg9ygALQAABSAJBlQAHBLASCWQAOCFACBbQACB/gSD/QgJDjAsCSQAGAUAKAJQAMAKAcAAQCOACEAgHQEGgHB5AAIAPAAgEg1agJGIgBAkMA+tgAPIGOgJMAkSgAQQgEgzgBgyMgr/AAwMg9DgAKQgDAggCAjgEg0ugNKIgKAlQgUBFgIBOMA98gAPIGPgJMAk1gAQQgEhsAEhkIAAgEMgrUAAvMg9CgALQAAAOgEASg");
	this.shape_3.setTransform(386.025,368.8961);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	// top_cabinets
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#BBE0EE").s().p("AL9mpIABhCIARAAIACgBIFfgHIAEAAIAAABQgCAnABA2IACBdIABBIQADFygDFzIAAAHQgCgCgEAAIi2gEIi6AKQAFnbgInOgAQhgUQgFAGgBAFQgBAIAMANIANASQAJAKALgBQAJgBAFgIQAFgJgDgIQgBgEgIgLQgHgNgFgFQgHgGgKAAQgJAAgHAGgAUcmrIAAhAIABAAIAFgBIAGAAIAFAAIABgBIFhgHIADgBIAAABQgCAnACA2IACBeIABBIQADFxgEF0IAAAHQgCgDgDAAIi2gEIi7AKQAGnagInPgAVGgUQgFAFgHANQgIALgBAEQgDAIAFAJQAFAIAJABQALABAJgKIANgSQAMgNgBgIQgBgFgFgGQgHgGgJAAQgKAAgHAGgA6VmzIABhCIARAAIACAAIFfgIIAEAAIAAABQgCAnABA2IACBdIABBIQADFygDFzIAAAHQgCgCgEAAIi2gEIi6AJQAFnagInOgA1xgeQgFAGgBAFQgBAIAMAOIANARQAJAKALgBQAJgBAFgIQAFgJgDgIQgBgDgIgMQgHgNgFgFQgHgGgKAAQgJAAgHAGgAx2m1IAAhAIABAAIAFgBIAGAAIAFAAIABgBIFhgHIADAAIAAAAQgCAnACA2IACBeIABBIQADFxgEF0IAAAHQgCgDgDAAIi2gEIi7AKQAGnagInPgAxMgeQgFAFgHANQgIAMgBADQgDAIAFAJQAFAIAJABQALABAJgKIANgRQAMgOgBgIQgBgFgFgGQgHgGgJAAQgKAAgHAGg");
	this.shape_4.setTransform(359.5442,90.65);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#8ED9EF").s().p("AJQnqQgCg1ADgXIAPAAIANABIAFgBIS5gIIAMAAIgBABQgGAsAEA+IAIBrQACAqABApQAKGpgMGqIABAIQgHgDgNAAIpigEIpwAKQAToggboTgASHILQAFndgInTQAAgxABgVIAAgEIAAgBIgBgBIgBgDIgBACQAAgBgBAAQAAAAgBAAQAAgBgBAAQAAAAgBAAIi2gDIipAIIgGgBIgMgBIgBABIgBAAIgBgEIgBAFIgBACQAAAAAAABQAAAAAAABQAAAAAAABQAAAAABABQgCAlABAzIACBdIABBIQADFygDF0QAAAPADACIAAgEQACAEAFAAIFpgHIAGgBQABAHACABgAalIKQAGnegInSQgBgyABgUIAAgFIAAgBIAAgBIgBgDIgBACQgBAAAAAAQgBgBAAAAQgBAAAAAAQgBAAAAAAIi2gEIirAJIAAgBIgEgBIgHAAIgBAAQgDAAgDABIgBgFIgCAHIgCACIAAACIAAACIABAAIAAABIABABQgCAkABAxIADBdIABBIQADFygEFzQAAAQADACIAAgFQADAFAFgBIFpgHIAFgBQABAIACABgA9Cn0QgCg1ADgYIAPABIANABIAFgBIS5gIIALAAIAAABQgGAsAEA+IAIBrQACAqABApQAKGpgMGqIAAAIQgGgDgNAAIpigEIpxAKQAToggaoTgA0LIBQAFndgInTQAAgxABgVIAAgEIAAgBIgBgBIgBgDIgBACQAAgBgBAAQAAAAgBAAQAAgBgBAAQAAAAgBAAIi2gDIipAIIgGgBIgMgBIgBABIgBAAIgBgEIgBAFIgBACQAAAAAAABQAAAAAAABQAAAAAAABQAAAAABABQgCAlABAzIACBdIABBIQADFygDF0QAAAPADACIAAgEQACAEAFAAIFpgHIAGgBQABAHACABgArtIAQAGnegInSQgBgyABgUIAAgFIAAgBIAAgBIgBgDIgBACQgBAAAAAAQgBgBAAAAQgBAAAAAAQgBAAAAAAIi2gEIirAJIAAgBIgEgBIgHAAIgBAAQgDAAgDABIgBgFIgCAHIgCACIAAACIAAACIABAAIAAABIABABQgCAkABAxIADBdIABBIQADFygEFzQAAAQADACIAAgFQADAFAFgBIFpgHIAFgBQABAIACABg");
	this.shape_5.setTransform(358.131,90.225);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#000000").s().p("Ac+JJIgTABIy5AIQgSABgIgGIAAAGQgKgDABgSQAMmqgLmpQAAgpgDgpIgIhrQgDg+AGgtQABgGADgBQADgBACAEIAAABIADAAIAaACIADAAIJYgKIJhAEQAJAAAGACIACgCQADgBACAEIAAABIABABIgBAAQABADAAADQgDAXACA5QAaIXgTIlQgHgCgCgIgAJRnpQAaITgTIgIJxgLIJhAEQANAAAHADIAAgIQAMmqgLmpQAAgpgDgpIgIhrQgDg+AGgtIAAgBIgMABIy4AIIgGAAIgNAAIgOgBQgDAYACA1gApUI/QgHABgMAAIy5AIQgSABgIgGIAAAGQgKgDABgSQAMmqgLmpQAAgpgDgpIgIhrQgDg+AGgtQABgGADgBQADgBACAEIAAABIADAAIAaACIADAAIJYgKIJhAEIAPABIACgBQADgBACAEIAAABIABABIgBAAIABAGQgDAXACA5QAaIXgTIlQgHgCgCgIgA9BnzQAaITgTIgIJxgLIJhAEQANAAAHADIAAgIQAMmqgLmpQAAgpgDgpIgIhrQgDg+AGgtIAAgBIgMABIy4AIIgGAAIgNAAIgOgBQgDAYACA1gASEIDIgFABIlpAHQgFABgDgFIAAAFQgDgCAAgQQAElzgDlyIgBhIIgDhdQgBgzACgmQAAAAAAgBQgBAAAAgBQAAAAAAgBQAAAAAAgBIACgBIABgGIABAFIAAgBIABAAIAMAAIAGABICqgIIC2AEQAAAAABAAQABAAAAAAQABAAAAABQAAAAABAAIABgCIABADIAAABIAAABIAAAFQgBAUABAyQAIHSgGHeQgCgBgBgIgAMMmkQAIHOgGHaIC7gJIC2ADQADAAACADIAAgHQAElzgDlyIgBhIIgChdQgCg2ACgnIAAgBIgDAAIlfAHIgCABIgSAAgAajICIgGABIlpAHQgFAAgCgEIAAAEQgDgCAAgPQADl0gDlyIgBhIIgChdQgBgwACglIgBAAIAAgBIgBgBIgBgCIABgCIACgCIABgGIABAFQAEgCADABIAAgBIAIABIADABIABAAICqgIIC2ADQABAAAAAAQABAAABABQAAAAAAAAQABAAAAABIABgCIABADIABABIAAABIAAAEQgBAVAAAxQAIHTgFHdQgCgBgBgHgAUqmmQAIHPgFHaIC6gKIC2AEQAEAAACADIAAgHQADl0gDlyIgBhIIgChdQgBg2ACgnIAAgBIgEABIlgAHIgCAAIgEABIgGAAIgFABIgBAAgA0OH5IgFABIlpAHQgFABgDgFIAAAFQgDgCAAgQQAElzgDlyIgBhIIgDhdQgBgzACgmQAAAAAAgBQgBAAAAgBQAAAAAAgBQAAAAAAgBIACgBIABgGIABAFIAAgBIABAAIAMAAIAGABICqgIIC2AEQAAAAABAAQABAAAAAAQABAAAAABQAAAAABAAIABgCIABADIAAABIAAABIAAAFQgBAUABAyQAIHSgGHeQgCgBgBgIgA6GmuQAIHOgGHaIC7gJIC2ADQADAAACADIAAgHQAElzgDlyIgBhIIgChdQgCg2ACgnIAAgBIgDAAIlfAHIgCABIgSAAgArvH4IgGABIlpAHQgFAAgCgEIAAAEQgDgCAAgPQADl0gDlyIgBhIIgChdQgBgwACglIgBAAIAAgBIgBgBIgBgCIABgCIACgCIABgGIABAFQAEgCADABIAAgBIAIABIADABIABAAICqgIIC2ADQABAAAAAAQABAAABABQAAAAAAAAQABAAAAABIABgCIABADIABABIAAABIAAAEQgBAVAAAxQAIHTgFHdQgCgBgBgHgAxomwQAIHPgFHaIC6gKIC2AEQAEAAACADIAAgHQADl0gDlyIgBhIIgChdQgBg2ACgnIAAgBIgEABIlgAHIgCAAIgEABIgGAAIgFABIgBAAgAVQAsQgKgBgFgIQgFgJADgIQABgEAJgMQAGgMAGgFQAGgGAKAAQAKAAAGAGQAGAFAAAGQABAGgLAPIgOASQgIAJgKAAIgBAAgARCAjIgOgSQgLgPABgGQAAgGAGgFQAGgGAKAAQAKAAAGAGQAGAFAGAMQAJAMABAEQADAIgFAJQgFAIgKABIgBAAQgKAAgIgJgAxCAiQgKgBgFgIQgFgJADgIQABgEAJgLQAGgNAGgFQAGgGAKAAQAKAAAGAGQAGAFAAAGQABAHgLAOIgOASQgIAJgKAAIgBAAgA1QAZIgOgSQgLgOABgHQAAgGAGgFQAGgGAKAAQAKAAAGAGQAGAFAGANQAJALABAEQADAIgFAJQgFAIgKABIgBAAQgKAAgIgJg");
	this.shape_6.setTransform(358.0738,90.175);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_6},{t:this.shape_5},{t:this.shape_4}]}).wait(1));

	// bottom_cabinets
	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#5CB4C2").s().p("EgzUAA7IgDgDQADgxABgpIAAgHIR/gEIADAAIAGAAIAAgBIAWAAIgBADIgSBeQAAAAAAAAQgBAAAAAAQgBAAAAAAQgBAAAAAAIAAAAIgDAAIgEgBIAAACIgFAAQgKgCgNAAIhcACIA5AAIwyAHIgQABIgBgBgEggzgAHIAHghIABgGIRmgDIAqgBIgBACQgHARgGAKIgGANIgDAIIgGATIgKAZIgBAEIgEAAQgKgCgNAAIhdABIA6ABIwyAHIgLAAgAI0AsIAAAAIgCgDIAHhhIDAADQBTABBBgCIBtgDIBQgCIACAAIALAAIA6AAIDOADQDlADB8gEIAAAEIgCAZQgCASAAARIgBAfIgEgBIgGAAQgKgCgNAAIhdACIA6AAIwzAHIgQABIAAgBgEAx9AAlIjWAAIgCAAIgCAAIgBgBQAAgvADgkIAAgBIAFAAIEBADQAfAAAMgCIAAAEIACBOIgBAAQgSADgbAAIgtgBg");
	this.shape_7.setTransform(380.65,210.6344);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#8ED9EF").s().p("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AAQAAAAgBAAIAAgFIACglIAAhAQAAgnAEgaIAAgGQAAAAABAAQABgBAAAAQAAgBABAAQAAgBAAAAQAAgGgJAAQhWgEiXACQisADhCgBIgCAAQgCgEgEABQgDABAAAHIAABQQAAA/ABARIACAcQABAFADACQADAAACgDgEgyMgGZIACAAICLAEQCCADCCgCQAnAAAbgDQAHgBADgCQACgCAAgDQABgBgBAAQAAgBAAgBQAAAAgBgBQAAAAgBAAQAAgBAAAAQgBAAgBAAQAAAAgBAAQAAAAgBABIAAgGIACgkIAAhBQAAgmAEgbIAAgFQAAgBABAAQAAAAABgBQAAAAAAgBQABAAAAgBQAAgFgJAAQhWgFiXADIhfABQhhABgugBIgCAAQgCgEgEACQgDABAAAGIAABQQAAA/ABARIACAcQABAGADABQADABACgEgEgzhgAOIABgSIAAgvIgBgwQAAgaAEhRIAFhHIgHEjgEAuwgARIAAgDIgCgFIABgHQACgugBhTQgChbACgmIADhWQACgygHiOQgDg0AAgsIABAAQABAAAAAAQABAAAAAAQABAAAAgBQAAAAABAAIABgBIACAAIECACQAhAAAMgBQABBxgCC3IgED6QgBAyAEAdQg3AMheACQhwADgnAFIgDABgEgzZgIZIAGg5IACgMIgBALIgBBRIgGgXg");
	this.shape_8.setTransform(379.7127,281.8318);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#000000").s().p("Au+LaIAAgBIAFAAIgDABIgCAAgAweLZIAGAAIg2gDQh6gIjQABQjxAAhYgDQh0gEhCgNIhggUQgwgIglACIgLABQgFABgFgDIgCgCIgIABIgBgLIAIAAIANpWIABgDQgrAEhFAAIhsABIgfAAIgnABQhbAAgagBQhEgDghAAIhKACQhKADiygBIlBgDQgGAAgDgBQgEgEADgEIAAAAIAAgBIAAgIIgBgHIgBAAIAGkjIAHhmIACg1QAAgdgEgXIAAgCIAChQIAAgMIAEgxIADADIABABIAQAAIQygHIg5gBIBcgBQANAAAKACIAFAAIAAgDIAEABIADAAIAAABQAAgBABAAQAAAAABAAQAAAAABAAQAAAAAAAAIAShfIABgCIgWAAIAAABIgGAAIgDAAIx/ADIAAgJIBIAAICDgBIDagDIGEABQDSABCNgCIAAAAIBQgBIFcgDIGEABQDvAACVgDQADAAADACQAEACgBACIgBACIgCAFIgMAbIgJASIgSA1IABABIADgDIADAAIAAAIIgHAAIAAAAIgBAAIABAAQAHAVADAZQACAUAAAkQAACUgEHKQgEF6AFDlIAAAFQAIABAHAEIgSAEQgCADgCABIgEAAIAAgDIgcADIgGAAIgjABIgigBgA/nKfIB1AYQAqAHA3ACQAcABBEABIGnABQB7ABAyAEIBEAGQApACAdgDQASgDAKAAQgGmgAImzIACjjQAAiAgIhjQgBgIABgEQgUACgjAAIw9AIIgOgCIgBADQACAEgBAJIgCBeIAABiIgKGqQAAAEgBABIgBABIAAAHQAAABABAAQAAAAAAABQAAAAAAABQAAAAAAABIgBABIgOJWIAAAGIABABIAMAAIALAAQAnAAAzAJgEgzMgI/IgOJkIAAACIAAAKIAAADIEoADQC7ACBegEIBMgCIgBgEIAAgLQAAgEACgCIACgBIgBgvIgBhLIgDhiQgBg2ACgnQAAgBgBAAQAAgBAAAAQAAgBAAAAQAAgBAAAAIABgCIACgGIABAFIABAAIABgBIANABIAHABIDFgJIDUAEQADAAACABIABgCIABAEIAAABIAAABIAAAEQgBAWABA0IAEDtIADACIAAAKIAAANIgBACIA6gCIABgIIABgFIABAAIAAgCIAHlsIABguIACgRIAAhSIgBgIQgCggADgUIAAgOIAAgRIAAAFIgCgSIAAgJQgBgHABgFIgJABIguABIw+AIQgJAAgHgBQADAFAAAKgEgpLgDUIADDwIACABQACACABAGIAAAJIgBAFIA+ACIBJABIB1AAIAXAAICZgCIgBgCIABgFIABgOIABgEIABgCIAAgrIgBhLIgChiQgDg5ADgpIAAgBIgEABImYAHIgCABIgUAAgAvCrGIxmAEIgBAGIgHAhIgLA+IALAAIQygHIg6AAIBdgCQANAAAKACIAEAAIABgDIAKgZIAGgTIADgKIAGgNQAGgJAHgSIABgCIgqABgAa6LPIAAgBIAFAAIgDABIgCAAgAZaLOIAGAAIg2gDQh6gHjQAAQjxABhYgDQh0gFhDgMIhfgUQgwgJglADIgLABQgFAAgFgCQgEgDACgDIgBgBIAcy9QAAgZgEgPIgEgKQABgDACgBIAAgCIgBgGIAGhWIACgOIAAgCIABgDIABgCQACgCADABIACABQCaADCaAAIBmgDQAbgCA3AAIFHACQBLADBfgBICpgDQAFAAADABQAAAAAAABQABAAAAABQAAAAABABQAAAAAAABIAAABIABACIAAAHIgDA8IgBAfIACAAIAAAHIgBAAIgBADQAAABgBABQAAAAAAABQgBAAAAAAQAAABgBAAQAFASADAWQACATAAAlQAACUgDHJQgEF7AEDkIAAAFQAIACAHAEIgSADQgCADgCABIgEAAIAAgCIgcACIgGAAIgjABIgigBgAKRKVIB1AYQAqAGA3ACQAbACBFAAIGnABQB7ABAyAEIBFAGQAnADAegDQASgDAKAAQgGmgAImzIACjkQAAh/gIhkQAAgHAAgFQgUACgjAAIw9AIQgJAAgHgBQACAFAAAKIgcTTIgBAHIAOgBIALAAQAnAAAzAKgAI1pqIACACIAAABIAAAAIAQAAIQzgHIg6gBIBdgBQANAAAKACIAGAAIAEABIABgfQAAgSACgSIACgZIAAgFQh8AFjlgEIjOgCIg6AAIgLAAIgCAAIhQABIhtAEQhBABhTgBIjAgCgA/3HgIgKABQgFAAgCgCQgBgDADgDQADgCAEgBIAIgBQAAj2gCj0IgBhLIgDhiQgBg2ACgnQAAgBgBAAQAAgBAAAAQAAgBAAAAQAAgBAAAAIABgCIACgGIABAFIAAAAIACgBIANABIAHABIDFgJIDUAEQABAAAAAAQABAAABAAQAAAAABABQAAAAAAABIABgDIACAEIAAABIAAABIAAAEQgBAWABA0QAGFGAAFMIAIABQAEAAAAAEQACAEgIABQgqAFgfABQgkABgMACIgpAJQgTADgmAAQhpABhpAFIgQAAIAAAFIgDACIAAgHgA/5jXQAGFSgBFaQAdgEAmgBIACAAIBRAAQArAAA1gDQAcgBASgEIAfgHQAKgBAPAAIAZAAIADAAIAigEQAOgCALABQAAjogCjoIgChLIgChiQgCg5ADgpIAAgBIgEABImYAHIgDABIgUAAgA3VHkQgBgBAAgBQAAAAAAgBQABAAAAgBQAAAAABgBQADgCADAAIAVgBQAAj6gDj4IgBhMIgDhiQgBg1ACgoQAAAAAAgBQgBAAAAgBQAAAAAAgBQAAAAAAgBIACgBIABgGIABAFIABgBIACAAIANAAIAHABIDFgIIDTADQAEAAACACIAAgCIABADIABABIAAABIAAAFQgBAVAAA0QAIFHgBFMQAMgCAIABQAFAAABADQABAGgHABQgeAJglADIg5ACQgcABgpAFIhGAIQhJAGiUABQgFAAgBgCgA28jZQAHFXgBFdIAbgBQAwgCAwgBQAtgBAXgCIA7gIQAngGATgBIA7gBQAaAAAOgDIANgCIANgEIABAAQABjpgDjoIgBhMIgBhiQgDg4ADgpIAAgBIgFAAImXAIIgCABIgVAAgAKBHWIgKAAQgFAAgCgCQgBgDADgDQADgCAEAAIAIgBQAAj2gCj0IgChMIgChiQgBg1ACgoQAAAAgBgBQAAAAAAgBQAAAAAAgBQAAAAAAgBIABgBIABgGIACAFIAAgBIACAAIANAAIAHABIDFgIIDUADQABAAAAAAQABAAABABQAAAAABAAQAAABAAAAIABgCIACADIAAABIAAABIAAAFQgBAVABA0QAGFHAAFMIAIABQAEAAAAADQACAFgIABQgrAFgfAAQgjABgMACIgpAKQgTADgmAAQhpABhpAEIgQABIAAAFIgDABIAAgGgAJ/jiQAGFTgBFaQAdgEAmgBIADAAIBRgBQAqAAA1gCQAcgBASgEIAfgHQALgCAOAAIAZAAIADAAIAigEQAOgBALABQAAjpgCjnIgChMIgBhiQgCg4ACgpIAAgBIgEAAImYAIIgCABIgVAAgASiHZQAAgBAAAAQAAgBAAAAQABgBAAAAQAAgBABAAQADgDADAAIAVgBQAAj6gDj4IgBhLIgChiQgCg2ACgnQAAgBAAAAQgBgBAAAAQAAgBAAAAQAAgBABAAIABgCIABgGIABAFIABAAIACgBIANABIAHABIDFgJIDTAEQAEAAACABIABgCIAAAEIABABIAAABIAAAEQgBAWAAA0QAIFHgBFMQAMgCAIAAQAGAAAAADQABAGgHABQgdAJgmAEIg5ABQgdABgpAFIhFAIQhJAHiUABQgFAAgCgDgAS8jjQAHFXgBFdIAbgBQAwgDAwgBQAtgBAXgCIA7gHQAngGATgCIA7gBQAbAAANgCIANgCIANgEIABAAQABjqgDjoIAAhLIgChiQgDg5ADgpIAAgBIgFABImXAHIgCABIgVAAgEgyJAAzQgEgCAAgEIAAgLIABgEQAAgBAAAAQAAgBABAAQAAAAABAAQAAAAABAAIAAgBIAAgrIAAggIgBgsIgChiQgCg1ADgoQgBAAAAgBQgBAAAAgBQAAAAAAgBQAAAAABgBIABgBIABgGIABAFIAAgBIACAAIAOAAIAGABIBugEIBXgEIDVADQAAAAABAAQABAAAAABQABAAAAAAQABABAAAAIABgCIACADIAAABIAAABIAAAFQgBAVABA0IADDsIADACIAAARQAAAFgCACQgCADgDgEQgCgBAAgEIAAgIIAAgGIAAgEQABAAAAgBQAAAAABAAQAAAAAAgBQABAAAAAAIAAgpIgChMIgChiQgCg4ACgpIAAgBIgDAAIksAGIhsACIgDABIgVAAIAABEIADCjIABBMIACACIAAAHIAAAFIABAHIgBACIgDABgEAunAArIgCgCIgEgFIgBgEIgCgFIAAgDIAAgCQADgvgBhMIgBh9QAFhqAAg1IgGhqQgGhvAFhqQAAgEACgDQACgDADAAQABAAAAABQAAAAABAAQAAAAABABQAAAAAAABIADgBIDWAAIAtABQAbAAASgDQAKgBABAFQABAEgGACQAEAsABArIAAACIAAAZQABAzgBAzIgFGyQgBAmADAYQABAMgDAEQgDADgKABQiSAPiMgBIAAADQAAAAgBAAQAAABAAAAQAAAAgBABQAAAAgBAAgEAupgJmQAAABAAAAQgBAAAAAAQgBABAAAAQgBAAAAAAIgBAAQAAArACA1QAICNgCAyIgEBWQgBAmACBcQABBSgDAuIgBAGIADAGIAAACIABABIADgCQAmgEBxgDQBegDA2gLQgDgcABgyIADj7QADi3gChxQgLACgiAAIkBgDIgCAAIgCABgEAyAgJuIAtABQAbAAASgDIABAAIgChQIAAgDQgMABgfAAIkBgCIgFgBIAAABQgDAkAAAxIABAAIACABIACAAgEgoQgA5QgJgBgFgJQgGgIADgJQACgEAJgNQAGgOAGgFQAHgGALAAQAKAAAGAGQAGAGAAAFQACAIgNAQIgOATQgJAJgKAAIgCAAgEgsigBFIgPgTQgMgQABgIQABgGAGgFQAHgHAKAAQALAAAGAHQAGAFAHAOQAJANABADQADAJgFAJQgGAJgKABIgBAAQgKAAgJgJgA2Ag+QgKgBgFgIQgGgJAEgJQABgEAJgMQAGgOAHgGQAGgGALAAQAKAAAGAGQAHAGAAAGQABAIgMAQIgPASQgJAJgKAAIgBAAgA6ShKIgPgTQgMgPABgIQAAgGAGgGQAIgGAJAAQALAAAGAGQAHAFAHAPQAIAMABAEQADAJgFAJQgFAIgKABIgBAAQgKAAgJgJgAT4hIQgKgBgFgJQgGgIAEgJQABgEAJgNQAGgOAHgFQAGgGALAAQAKAAAGAGQAGAGABAFQABAIgMAQIgPATQgJAJgKAAIgBAAgAPlhUIgOgTQgMgQABgIQABgGAFgFQAHgHAKAAQALAAAGAHQAHAFAHAOQAIANABADQADAJgFAJQgFAJgKABIgBAAQgKAAgKgJgEgpXgFlIgDAAIAAAAQgCAEgDgBQgDgBgBgGIgCgcQgBgRAAg/IAAhQQAAgGADgBQAEgCACAEIACAAQBCACCrgDQCYgDBWAFQAJAAAAAFQgBABAAAAQAAABAAAAQgBABAAAAQgBAAgBABIAAAFQgDAbAAAmIAABBIgCAkIAAAGQAAgBABAAQABAAAAAAQABAAAAAAQABAAAAABQABAAAAAAQABABAAAAQAAABAAABQAAAAAAABQAAADgDACQgCACgHACQgcACgmAAIhkABQiVAAiWgGgEgpcgG2IABAoIACAfIABAAQDOAHDPgCQAdAAAUgEIAAgFIABgUIABgvIAAguQgBgSACgQIACgaQjwgDh4AFIg5ACQgegBgYgFgEgwFgFhIiLgEIgCAAIgBAAQgCADgDAAQgDgCgBgFIgCgcQgBgSAAg+IAAhQQAAgHADgBQAEgBACAEIACAAQAuABBhgBIBegCQCYgCBWAEQAJAAgBAGQAAAAAAABQAAAAgBABQAAAAAAABQgBAAgBAAIAAAGQgDAaAAAnIAABAIgCAlIgBAFQABAAABAAQABAAAAAAQABAAAAAAQABAAAAAAQABAAAAABQABAAAAABQAAAAAAABQAAABAAABQAAADgCACQgDACgHABQgbADgnAAIhiAAQhRAAhRgBgEgyVgG2IABAoIACAeIABAAICMAEQCIADCJgCQAeAAASgDIAAgGIABgTIACgvIAAgvQAAgRABgRIACgZQjQgDh3ADIghABIg5ACQgegBgYgFgA3IlpIgCAAIAAAAQgDADgDAAQgCgCgBgFIgCgcQgCgRAAg/IAAhQQABgHADgBQADgBACAEIADAAQBCABCrgDQCXgCBWAEQAJAAAAAGQAAAAAAABQgBAAAAABQAAAAgBABQAAAAgBAAIAAAGQgEAaAAAnIAABAIgCAlIAAAFQABAAAAAAQABAAABAAQAAAAABAAQAAAAABAAQAAAAABABQAAAAAAABQAAAAABABQAAABgBABQAAADgCACQgCACgIABQgbADgnAAIhjAAQiVAAiXgFgA3Mm6IABAoIACAeIAAAAQDPAIDPgDQAdAAATgDIAAgGIABgTIABgvIAAgvQAAgRACgRIACgZQjwgDh4AEIg5ACQgfgBgXgFgEggAgFqIgDAAIAAAAQgDAEgDgBQgCgBgBgGIgDgcQgBgRAAg/IAAhQQAAgGAEgBQADgCACAEIACAAQBDACCrgDQCXgDBWAFQAJAAAAAFQAAABAAAAQgBABAAAAQAAABgBAAQAAAAgBABIAAAFQgDAbgBAmIAABBIgCAkIAAAGQABgBAAAAQABAAABAAQAAAAABAAQAAAAABABQAAAAABAAQAAABAAAAQABABAAABQAAAAAAABQgBADgCACQgCACgIABQgbADgnAAIhjABQiVAAiWgGgEggGgG7IABAoIADAfIABAAQDOAHDPgCQAdAAATgEIAAgFIABgUIABgvIAAguQAAgSABgQIADgaQjwgDh4AFIg6ABQgeAAgYgFgASwl0IgCAAIAAAAQgCAEgEgBQgCgBgBgGIgDgcQgBgRAAg/IAAhQQAAgGAEgBQADgCACAEIADAAQBBACCsgDQCXgDBWAFQAJAAAAAFQAAABAAAAQgBABAAAAQAAABgBAAQAAAAgBABIAAAFQgEAbAAAmIAABBIgCAkIAAAGQABgBAAAAQABAAABAAQAAAAABAAQAAAAABABQAAAAABAAQAAABAAAAQAAABABABQAAAAgBABQAAADgCACQgCACgIACQgbACgnAAIhjABQiVAAiXgGgASrnFIACAoIACAfIABAAQDOAHDPgCQAdAAATgEIAAgFIABgUIABgvIAAguQAAgSACgQIACgaQjwgDh4AFIg6ACQgegBgYgFgAJ4l0IgDAAIgBAAQgCADgCAAQgDgCgCgFIgCgcQgBgSAAg+IAAhQQAAgHADgBQAFgBABAEIACAAQBCABCsgDQCXgCBWAEIABAAQAIABAAAFQAAAAAAABQgBAAAAABQAAAAgBABQAAAAgBAAIAAAGQgDAagBAnIAABAIgCAlIAAAFIABAAIAEAAQAAAAABABQAAAAAAABQABAAAAABQAAABAAABQgBADgCACIgDABIgHACQgbADgnAAIhjAAQiVAAiWgFgAJynFIABAoIADAeIABAAQDOAIDPgDQAdAAATgDIAAgGIABgTIABgvIAAgvQAAgRABgRIADgZQjwgDh4AEIg6ACQgegBgYgFgEgmSgGvQgIgFgCgLQgBgMAJgGQAHgFANgBQAegCAHAAQAMAAAIAFQAGAFABAKQABAKgGAFQgIAHgUABIgaACIgGAAQgKAAgHgDgEgvLgGwQgJgEAAgMQgCgLAKgGQAGgFANgBQAegDAHABQANAAAGAEQAIAGAAAJQABAKgGAGQgIAHgUABIgaABIgGAAQgKAAgHgDgA0Cm0QgJgEgBgMQgBgLAJgGQAHgFANgBQAdgDAIABQAMAAAHAFQAHAFAAAJQABAKgGAGQgIAHgUABIgZABIgGAAQgLAAgGgDgA87m0QgJgFgBgMQgCgLAKgGQAHgFANgBQAegCAHAAQAMAAAHAFQAHAFABAKQAAAKgGAFQgHAHgVABIgaACIgFAAQgLAAgGgDgAV2m+QgJgFgBgLQgCgMAKgGQAHgFANgBQAegCAHAAQAMAAAHAFQAHAFAAAKQABAKgGAFQgIAHgUABIgaACIgFAAQgLAAgGgDgAM9m/QgJgEgBgMQgCgLAKgGQAGgFAOgBQAdgDAIABQAMAAAHAEQAHAGABAJQAAAKgGAGQgHAHgVABIgaABIgFAAQgLAAgGgDg");
	this.shape_9.setTransform(380.35,276.6813);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#BBE0EE").s().p("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");
	this.shape_10.setTransform(302.6,272.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7}]}).wait(1));

	// stove
	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#9A9697").s().p("Ar1KZQgEgHgCgOQgGgngDhPQgDhaAHgtQAEgdAAgOIABgBQACgDAAgEQACgSABg/IABifQACiJgGhMIgGhDQgDgnABgcQAFg8ABgfIAAg1QAAghACgUIAHgwQADgXgBgaIgBgHIApAAQC3ACBbAAIECgEQCbgCBmADICvAGQBNABCzgFQCbgEBaACQACAVAEAVIADARIADCRIAAADQgHBlAICoQAJDKgBBHQgCBMgHBLIgGA3QgCAgAABBQgCA/gRA9QgCAKgGACIgIgBIgDABQhJgIheADIjCAOQhpAHiKACIjzABQlDADkWAOIgCAAIgHAAIgDABQgJAAgHgLgAktkPQggABgLADQgbAGgXAUQgVATgOAcQgWAsAABEIABA2IgDAsQgDAmABA4IACBfQABAtADAOQAHAhAUASQAPAOAfAIQAmALAxADQAdACA7AAIEKAAIADAAICgAAQA7AAAdgCQAxgEAlgKQAggJAPgNQAUgSAHgiQADgOABgtIACheQABg4gDgnIgDgsIAAg1QAAhEgWgtQgNgbgWgTQgXgVgbgGQgLgCgfgBQikgCijAEQhggChhAAIhtAAgAEioMQgNADgKAKQgKAJgEAOQgEANAEANQAEASAPALQAQALARgCQANgBAMgJQALgIAFgMQAJgVgIgUQgJgUgVgHQgIgDgIAAIgLABgAIqoMQgMAFgIAKQgIAKgCAOQgCANAFANQAFAMALAIQALAIANACQANACAMgFQANgGAIgKQAFgIACgGQAGgSgHgRQgFgMgKgIQgLgJgNgCIgHAAQgJAAgKAEgAoQoUQgOACgLAJQgMAKgEANIgCAJQgDAUAMAQQAMASAUADQAPADAOgHQAPgHAIgNQAHgNAAgOQgBgPgIgMQgHgLgOgGQgKgFgLAAIgGAAgAjsoWQgPACgLAIQgLAJgGANQgFAOADAOQAFAYAVAKQAUALAWgJQANgFAIgMQAJgMABgPQABgOgIgNQgHgNgNgGQgLgGgMAAIgEAAgAAeoXQgZAFgKAWQgGAMACAPQABAOAIALQALAQAUADQATAEARgMQATgNADgXQACgZgSgRQgJgIgLgDQgHgCgHAAIgJABgAEKopIhpgDIhpgEQhogDi8AEQjOAEhXgBIiYgDIhIACQABgCABgFIADgMIANgmIAagyIABgCQBpgGC8ABIIuAFICKAAQA4gBBvgGQBkgEBDAFIA/AFQAkACAbgDIACAAIABAAIANAAIAAAJIABAIIgBAIIgEASIgCA+IAAAEQhZgDiRAEQiZAFhKAAIgYAAgADZo6IDVAFQB8ADBZgHQAXgCAIgHQAEgCABgDIADgEQABgDgCgGQgOgkgVgNQgOgHgfgCQhQgFiGgBQg5gBlxADQkFACingGQg+gCgeAIQgYAGgSAOQgUAOgIAVIgCAGIgBACQgBADACADQAGAKAVADQApAFBVAAIH7gCIBQAAIBsABg");
	this.shape_11.setTransform(360.7879,271.3021);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#283D50").s().p("AGEAmQiXgFhMgBIh1AAIoTACQhaABgzgGQgMgBgGgFIABgEQAEgTAZgQQAZgQAmgEQAXgCAuABQCuAGExgCQFVgDCJACQBAABAgADQAqACARAQQAMAMAHAXIgDACQgIAJgVABQg9AEhRAAIhVgBg");
	this.shape_12.setTransform(363.225,209.8969);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#1E3B4D").s().p("AjgEvQg6gBgZgCQgugDgjgKQgcgIgPgOQgQgRgGghQgCgRgCghQgDh5ADg8IAEhOIgBgxQACggAPgnQAGgWAKgOQAIgMAQgOQASgPARgFQAPgEAcAAQCTgCBsABIACACQACABAGAAIAugCIA+ADQAIAAABgBIADgDQBrgCCUACQAbAAAPAFQARAFASAPQAQANAIAMQAJAOAHAWQAPAoACAgIgBAwIADBPQADA7gDB5QgBAigCAQQgFAigRAQQgOAOgcAIQgkALguADQgaACg5AAIkRABIgDAAg");
	this.shape_13.setTransform(362.05,275.3382);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#000000").s().p("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");
	this.shape_14.setTransform(360.7596,271.465);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11}]}).wait(1));

	// fridge
	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#454341").s().p("AhlCkIgBAAIAAgDIAAghIgBgFIAAgNIADAAQBngEBoACIABAAIgCANIgCApIgEAAQgUACgzABgAhphsIgBAAIAAgCIAAghIgBgFIAAgOIADAAQBogCBnABIABAAQgCAGAAAHIgCApIgEAAQgUADgzAAg");
	this.shape_15.setTransform(569.9625,190.8);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#FFFFF0").s().p("AHLApIwwgHIgBAAIAAgIQgCgeABgQIACgUIAEAAIScAEQAdAAAQgCIAABMIgCAAQguADhHAAIgmAAg");
	this.shape_16.setTransform(616.1188,191.6475);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#C2D5DB").s().p("ApFRHQgEgzgHgYIgNgjQgJgXgEgNQgDgNgFglQgKhegCgvQgCgjgDgRQgJgpgDgUQgDgTAAglQAAh5AMhWQAQhvAmhWIABAAQADgCAAgEIAEhSIRIAHQBRABAxgDIAFgBIAABxIAAAEQgHBlAFCqQgCACAAAGIAOEuQADA+gBASQAAAigHBEQgGA9gBAiIgCAAQiZABnOAMQkXAGjGAAIiEAAgAlEDZQAAABAAAAQABAAAAABQABAAAAAAQABAAAAAAQABAAAAAAQABAAAAAAQABgBAAAAQABAAAAAAQACgCAAgFIAAgUIABgGIAAgGIABgDIAAgPIABgFIABgHIgBgCIAAgDQgBgCgFAAQhKgChuACIgdABIgEABIgDgBQgBAAAAAAQAAAAgBAAQAAAAAAAAQgBAAAAABQgCACAAAFIAAARIABAGIAAAiIAAAFQAAAAAAABQAAAAAAAAQAAABABAAQAAABAAAAQACACADAAICRABQAvAAATgDIABABgApDABIgDAAIAAgPQAAgFgDgCIAIqdIABg2IABgyIgCgzIgHiNQACgCgBgEIgBgbIACgXQABgSALgPQAFgGAEgDQAHgEANgCQAKgDAJAAIA7gBIACAAIPOAFIACAAIABAAQAkgCAsAEQALABAFACIAJAFQAIAFAEAHQAIAMACAYQADAbgBAbQgBAEABADIAAAAIAAAEQgBCdADBOIACBNQABA/gFA0IAAAHIAAABQgDDRAGCvIAAAAIgBAHIAACQgAlIg2QAAABAAAAQABAAAAABQABAAAAAAQABAAAAAAQABAAAAAAQABAAAAAAQABgBAAAAQABAAAAAAQACgCAAgFIAAgUIABgGIAAgGIABgDIAAgPIABgFIABgHIgBgCQAAAAAAgBQAAAAAAgBQAAAAAAgBQAAAAAAAAQgBgCgFAAQhKgChuACIgdABIgEABQAAAAgBgBQAAAAAAAAQgBAAAAAAQgBAAAAAAQgBAAAAAAQAAAAgBAAQAAAAAAAAQgBAAAAABQgCACAAAFIAAARIABAGIAAAiIAAAFQAAAAAAABQAAAAAAAAQAAABABAAQAAABAAAAQACACADAAICRABQAvAAATgDIABABg");
	this.shape_17.setTransform(613.0292,186.4453);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#000000").s().p("ApNRRIgBgCIgBgBQgEgCABgDIACgCQgDgzgJgcIgUg0QgJgcgFgzQgIhMgDg1QgCgngCgNQgJgjgDgSQgEgYABgwQACiQANhLQAHgrAThFQANgvANgUIADgDIAAgEIAFhcQgCgnABgTIACggIgBgDQgChGACiLIAJosQAAgfgFhOQgEhBABgnIgBgFQgCgPACgeIACgRQADgOALgPIAKgJQAGgEAOgDIAagEQAKgBAKABIAlAAIADAAIADAAIPQAEIAEABQAZgBATAAIAaACIAXADQAGACAHAHQAJAHAFAGQALAQABAlIABArIAAAGQACADgBAGQgEBEAFCRQADCMgEBJIgBADIAAABQgDDZAHCzQABAGgDADIAAFMQABACAAAGQgIBuAFC0IAAAGIgBACQAHCAAGCcIACA+QAABQgQCQIAAADIgBACIgBABQAAABgBAAQAAAAgBABQAAAAgBAAQAAAAgBgBIgBAAIgBAAQinAAnAAMQmDAKjigEIAAAAIgDACIgDgCgApMCyQAAAEgDACIAAABQgnBWgQBuQgMBWAAB5QAAAlADATQADAUAJApQADARACAjQACAvAKBeQAFAlADANQAEANAJAXIANAjQAHAYAEAzQDmADF7gJQHOgMCZgBIACABQABgiAGg+QAHhEAAgiQABgSgDg+IgOkuQAAgFACgDQgFipAIhmIgBgEIAAhxIgFABQgxADhRgBIxIgHgApIAeQgBAQACAfIAAAIIABAAIQwAHQBhABA6gEIACAAIAAhNQgQACgdAAIycgEIgEAAIgCAUgAKHADIAAiQIABgHIAAAAQgGivADjRIAAAAIAAgIQAFg0gBg/IgChNQgDhOABidIAAgEIAAAAQgBgDABgEQABgbgDgbQgCgYgIgMQgEgHgIgFIgJgFQgFgCgLgBQgsgEgkACIAAAAIgDAAIvOgFIgCAAIg7ABQgJAAgKADQgNACgHAEQgEADgFAGQgLAPgBASIgCAXIABAbQABAFgCACIAHCMIACAzIgBAyIgBA2IgIKdQADACAAAFIAAAPIADAAgAlEDYIgBgBQgTADgvAAIiRgBQgDAAgCgCQAAAAAAAAQgBgBAAAAQAAgBAAAAQAAgBAAAAIAAgFIAAgiIgBgGIAAgRQAAgFACgCQABAAAAAAQAAgBAAAAQABAAAAAAQAAAAABAAIADABIAEgBIAdgBQBugCBKACQAFAAABACIAAADIABACIgBAHIgBAFIAAAPIgBADIAAAGIgBAGIAAAUQAAAFgCACQAAAAAAABQgBAAAAAAQgBAAAAAAQgBAAgBAAQAAAAgBAAQAAAAgBAAQAAAAgBgBQAAAAAAgBgAoVCmIABAFIAAAhIAAACIABAAICCABQA0AAATgCIAFAAIACgpIABgNIAAAAQhogChpADIgCAAgAlIg3IgBgBQgTADgvAAIiRgBQgDAAgCgCQAAAAAAAAQgBgBAAAAQAAgBAAAAQAAgBAAAAIAAgFIAAgiIgBgGIAAgRQAAgFACgCQABAAAAAAQAAgBAAAAQABAAAAAAQAAAAABAAQAAAAABAAQAAAAABAAQAAABABAAQAAAAAAAAIAEgBIAdgBQBugCBKACQAFAAABACQAAAAAAABQAAAAAAABQABAAgBABQAAAAAAAAIABACIgBAHIgBAFIAAAPIgBADIAAAGIgBAGIAAAUQAAAFgCACQAAAAAAABQgBAAAAAAQgBAAAAAAQgBAAgBAAQAAAAgBAAQAAAAgBAAQAAAAgBgBQAAAAAAgBgAoZhpIABAFIAAAhIAAACIABAAICCABQA0AAATgCIAFAAIACgpQAAgIABgFIAAAAQhogChpADIgCAAg");
	this.shape_18.setTransform(613.0157,186.5029);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15}]}).wait(1));

	// wall
	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#F4E7D7").s().p("EgxzAjIMAAAhGPMBjnAAAMAAABGPg");
	this.shape_19.setTransform(383.6,235.2);

	this.timeline.addTween(cjs.Tween.get(this.shape_19).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(38.3,10.4,695.5,452.40000000000003);


(lib.yes_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("clicksound");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// yes
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#B53366").s().p("AijDkIAmitQAQAlAZAXQAYAXAWAAQAMAAAHgIQAHgJAAgNQAAgMgFgIQgGgKgLgGIglgXQgpgagSggQgTghAAgwQAAivCnAAQBMAABBAjIgnCjQgSglgWgVQgXgTgYgBQgMABgIAHQgHAHAAAMQAAAQAKAJQAJAKAkAUQAmAVAUAUQAVASAMAcQAMAdAAAnQAACuioAAQhWAAhJgmg");
	this.shape.setTransform(262.175,62.35);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#B53366").s().p("AiRECIAAoDIEjAAIAACCIiJAAIAABAIBfAAIAACAIhfAAIAAA/ICJAAIAACCg");
	this.shape_1.setTransform(229.4,62.375);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#B53366").s().p("AhNECIAAjhIiFkiICdAAIA1B1IA2h1ICdAAIiGEiIAADhg");
	this.shape_2.setTransform(190,62.375);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#B53366").s().p("Ai6EDIArjEQATAqAcAaQAcAaAYAAQAOAAAJgJQAHgKABgOQAAgOgHgKQgFgKgNgIIgrgbQgvgcgUglQgVgmgBg3QAAjHC/AAQBWAABKAoIgsC5QgUgqgbgWQgZgXgbAAQgOAAgJAIQgIAIAAAOQAAASALAKQALALApAYQAqAYAYAVQAYAWAOAfQANAhAAAtQAADGi/AAQhjAAhTgsg");
	this.shape_3.setTransform(267.2,62.125);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#B53366").s().p("AikElIAApJIFJAAIAACTIiaAAIAABJIBsAAIAACSIhsAAIAABIICaAAIAACTg");
	this.shape_4.setTransform(229.9,62.175);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#B53366").s().p("AhYElIAAkAIiXlJICyAAIA9CFIA+iFICyAAIiYFJIAAEAg");
	this.shape_5.setTransform(185.1,62.175);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#853054").s().p("Ai6EDIArjEQATAqAcAaQAcAaAYAAQAOAAAJgJQAHgKABgOQAAgOgHgKQgFgKgNgIIgrgbQgvgcgUglQgVgmgBg3QAAjHC/AAQBWAABKAoIgsC5QgUgqgbgWQgZgXgbAAQgOAAgJAIQgIAIAAAOQAAASALAKQALALApAYQAqAYAYAVQAYAWAOAfQANAhAAAtQAADGi/AAQhjAAhTgsg");
	this.shape_6.setTransform(267.2,62.125);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#853054").s().p("AikElIAApJIFJAAIAACTIiaAAIAABJIBsAAIAACSIhsAAIAABIICaAAIAACTg");
	this.shape_7.setTransform(229.9,62.175);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#853054").s().p("AhYElIAAkAIiXlJICyAAIA9CFIA+iFICyAAIiYFJIAAEAg");
	this.shape_8.setTransform(185.1,62.175);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_5},{t:this.shape_4},{t:this.shape_3}]},1).to({state:[{t:this.shape_8},{t:this.shape_7},{t:this.shape_6}]},1).wait(2));

	// oval
	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f().s("#B53366").ss(3,1,1).p("AP3AAQAAD/kpC0QkpC0mlAAQmkAAkpi0Qkpi0AAj/QAAj+Epi0QEpi0GkAAQGlAAEpC0QEpC0AAD+g");
	this.shape_9.setTransform(225.5,63.5);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#F4E7D7").s().p("ArNGzQkpi0AAj/QAAj+Epi0QEpi0GkAAQGlAAEpC0QEpC0AAD+QAAD/kpC0QkpC0mlAAQmkAAkpi0g");
	this.shape_10.setTransform(225.5,63.5);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f().s("#B53366").ss(3,1,1).p("ASDAAQAAEilTDNQlRDNnfAAQndAAlTjNQlSjNAAkiQAAkhFSjNQFTjNHdAAQHfAAFRDNQFTDNAAEhg");
	this.shape_11.setTransform(225.5,63.525);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#F4E7D7").s().p("AswHvQlSjNAAkiQAAkhFSjNQFSjNHeAAQHfAAFSDNQFSDNAAEhQAAEilSDNQlSDNnfAAQneAAlSjNg");
	this.shape_12.setTransform(225.5,63.525);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f().s("#853054").ss(3,1,1).p("ASDAAQAAEilTDNQlRDNnfAAQndAAlTjNQlSjNAAkiQAAkhFSjNQFTjNHdAAQHfAAFRDNQFTDNAAEhg");
	this.shape_13.setTransform(225.5,63.525);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_10},{t:this.shape_9}]}).to({state:[{t:this.shape_12},{t:this.shape_11}]},1).to({state:[{t:this.shape_12},{t:this.shape_13}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(108.5,-7.9,234,142.9);


(lib.replay_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("clicksound");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// play
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#B53366").s().p("Ag5DAIAAioIhjjXIB1AAIAnBXIAohXIB1AAIhjDXIAACog");
	this.shape.setTransform(293.875,62.45);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#B53366").s().p("AA6DAIgPhCIhTAAIgPBCIh1AAIBdl/ICkAAIBYF/gAgUAkIAqAAIgWhcg");
	this.shape_1.setTransform(266.1,62.45);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#B53366").s().p("AhsDAIAAl/IBzAAIAAEeIBmAAIAABhg");
	this.shape_2.setTransform(237.525,62.45);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#B53366").s().p("AiCDAIAAl/IBwAAQA9AAAaAJQAaAIASAhQASAfAAAvQAAA5gZAkQgaAlgmAAQgbAAgdgiIAACfgAgOgYIABAAIAHAAQANAAAJgMQAIgLAAgUQAAgYgIgIQgIgJgUAAIgCAAg");
	this.shape_3.setTransform(210.525,62.45);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#B53366").s().p("AhsDAIAAl/IDZAAIAABhIhmAAIAAAvIBHAAIAABgIhHAAIAAAuIBmAAIAABhg");
	this.shape_4.setTransform(183.15,62.45);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#B53366").s().p("AAXDAIAAgEQAAhDgNgjQgMgkgXAAIgCAAIAACOIhzAAIAAl/IBzAAQA8AAAUAEQAUAEAPAPQAQAOAJAYQAJAYAAAcQAAA6geAcQArBHAIBxgAgbgmIADAAQARAAAHgJQAHgJAAgUQAAgkggAAIgCAAg");
	this.shape_5.setTransform(155.225,62.45);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#B53366").s().p("AhBDeIAAjCIh0j5ICHAAIAuBkIAvhkICHAAIhzD5IAADCg");
	this.shape_6.setTransform(306.7,64.425);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#B53366").s().p("ABDDeIgShMIhgAAIgRBMIiIAAIBtm7IC9AAIBnG7gAgXAqIAxAAIgZhrg");
	this.shape_7.setTransform(274.575,64.425);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#B53366").s().p("Ah9DeIAAm7ICFAAIAAFMIB2AAIAABvg");
	this.shape_8.setTransform(241.475,64.425);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#B53366").s().p("AiXDeIAAm7ICCAAQBHAAAeAKQAeAKAVAlQAVAlgBA2QAABCgcAqQgeArgsAAQggAAgignIAAC3gAgRgcIACAAIAHAAQAQAAAKgNQAJgNAAgZQABgagKgKQgJgKgXAAIgDAAg");
	this.shape_9.setTransform(210.3,64.425);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#B53366").s().p("Ah9DeIAAm7ID6AAIAABvIh1AAIAAA3IBSAAIAABvIhSAAIAAA3IB1AAIAABvg");
	this.shape_10.setTransform(178.55,64.425);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#B53366").s().p("AAbDeIAAgEQAAhOgPgpQgOgpgbAAIgCAAIAACkIiGAAIAAm7ICGAAQBFAAAXAEQAYAFASARQARAQALAcQAKAdAAAfQAABDgiAhQAxBSAKCDgAgfgsIAEAAQATAAAIgLQAJgKAAgXQAAgqglAAIgDAAg");
	this.shape_11.setTransform(146.225,64.425);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#853054").s().p("AhCDeIAAjCIhzj5ICIAAIAuBkIAuhkICHAAIhzD5IAADCg");
	this.shape_12.setTransform(306.75,64.425);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#853054").s().p("ABDDeIgShMIhgAAIgRBMIiIAAIBtm7IC9AAIBnG7gAgXAqIAxAAIgZhrg");
	this.shape_13.setTransform(274.625,64.425);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#853054").s().p("Ah9DeIAAm7ICFAAIAAFMIB2AAIAABvg");
	this.shape_14.setTransform(241.525,64.425);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#853054").s().p("AiWDeIAAm7ICBAAQBHAAAeAKQAeAKAVAlQAUAlABA2QgBBCgdAqQgdArgtAAQgfAAghgnIAAC3gAgQgcIABAAIAIAAQAQAAAJgNQAKgNAAgZQgBgagIgKQgKgKgXAAIgCAAg");
	this.shape_15.setTransform(210.35,64.425);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#853054").s().p("Ah8DeIAAm7ID6AAIAABvIh1AAIAAA3IBRAAIAABvIhRAAIAAA3IB1AAIAABvg");
	this.shape_16.setTransform(178.6,64.425);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#853054").s().p("AAbDeIAAgEQAAhOgPgpQgOgpgbAAIgCAAIAACkIiGAAIAAm7ICGAAQBFAAAXAEQAYAFASARQARAQALAcQAKAdAAAfQAABDgiAhQAxBSAKCDgAgfgsIAEAAQATAAAIgLQAJgKAAgXQAAgqglAAIgDAAg");
	this.shape_17.setTransform(146.275,64.425);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6}]},1).to({state:[{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12}]},1).wait(2));

	// oval
	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f().s("#B53366").ss(3,1,1).p("AP3AAQAAD/kpC0QkpC0mlAAQmkAAkpi0Qkpi0AAj/QAAj+Epi0QEpi0GkAAQGlAAEpC0QEpC0AAD+g");
	this.shape_18.setTransform(225.5,63.5);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#F4E7D7").s().p("ArNGzQkpi0AAj/QAAj+Epi0QEpi0GkAAQGlAAEpC0QEpC0AAD+QAAD/kpC0QkpC0mlAAQmkAAkpi0g");
	this.shape_19.setTransform(225.5,63.5);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f().s("#B53366").ss(3,1,1).p("ASDAAQAAEilTDNQlRDNnfAAQndAAlTjNQlSjNAAkiQAAkhFSjNQFTjNHdAAQHfAAFRDNQFTDNAAEhg");
	this.shape_20.setTransform(225.5,63.525);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#F4E7D7").s().p("AswHvQlSjNAAkiQAAkhFSjNQFSjNHeAAQHfAAFSDNQFSDNAAEhQAAEilSDNQlSDNnfAAQneAAlSjNg");
	this.shape_21.setTransform(225.5,63.525);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f().s("#853054").ss(3,1,1).p("ASDAAQAAEilTDNQlRDNnfAAQndAAlTjNQlSjNAAkiQAAkhFSjNQFTjNHdAAQHfAAFRDNQFTDNAAEhg");
	this.shape_22.setTransform(225.5,63.525);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_19},{t:this.shape_18}]}).to({state:[{t:this.shape_21},{t:this.shape_20}]},1).to({state:[{t:this.shape_21},{t:this.shape_22}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(108.5,-7.9,234,142.9);


(lib.play_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("clicksound");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// play
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#B53366").s().p("AhMECIAAjhIiGkiICdAAIA1B1IA2h1ICdAAIiGEiIAADhg");
	this.shape.setTransform(279.8,62.375);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#B53366").s().p("ABNECIgUhYIhwAAIgUBYIidAAIB9oDIDdAAIB3IDgAgbAxIA4AAIgch9g");
	this.shape_1.setTransform(242.575,62.375);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#B53366").s().p("AiRECIAAoDICaAAIAAGBICJAAIAACCg");
	this.shape_2.setTransform(204.225,62.375);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#B53366").s().p("AivECIAAoDICWAAQBTAAAjAMQAiAMAZArQAXArAAA+QABBNgjAxQghAxg0AAQgkAAgogtIAADVgAgUghIADAAIAIABQATAAAKgQQAMgPgBgcQAAgfgKgLQgLgMgbAAIgDAAg");
	this.shape_3.setTransform(168.05,62.375);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#B53366").s().p("AhXElIAAkAIiYlJICzAAIA8CFIA+iFICyAAIiYFJIAAEAg");
	this.shape_4.setTransform(287.3,62.175);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#B53366").s().p("ABYElIgXhkIh/AAIgXBkIizAAICPpJID7AAICHJJgAgfA4IBBAAIghiPg");
	this.shape_5.setTransform(244.875,62.175);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#B53366").s().p("AilElIAApJICwAAIAAG2ICbAAIAACTg");
	this.shape_6.setTransform(201.25,62.175);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#B53366").s().p("AjHElIAApJICrAAQBeAAAoANQAnANAbAxQAcAyAABGQAABXgnA4QgmA5g7AAQgpAAgtgzIAADxgAgWgmIACAAIAKABQAVAAANgRQAMgSAAggQAAgjgMgNQgMgNgfAAIgDAAg");
	this.shape_7.setTransform(160.075,62.175);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#853054").s().p("AhXElIAAkAIiYlJICzAAIA8CFIA+iFICyAAIiYFJIAAEAg");
	this.shape_8.setTransform(287.3,62.175);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#853054").s().p("ABYElIgXhkIh/AAIgXBkIizAAICPpJID7AAICHJJgAgfA4IBBAAIghiPg");
	this.shape_9.setTransform(244.875,62.175);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#853054").s().p("AilElIAApJICwAAIAAG2ICbAAIAACTg");
	this.shape_10.setTransform(201.25,62.175);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#853054").s().p("AjHElIAApJICrAAQBeAAAoANQAnANAbAxQAcAyAABGQAABXgnA4QgmA5g7AAQgpAAgtgzIAADxgAgWgmIACAAIAKABQAVAAANgRQAMgSAAggQAAgjgMgNQgMgNgfAAIgDAAg");
	this.shape_11.setTransform(160.075,62.175);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4}]},1).to({state:[{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8}]},1).wait(2));

	// oval
	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f().s("#B53366").ss(3,1,1).p("AP3AAQAAD/kpC0QkpC0mlAAQmkAAkpi0Qkpi0AAj/QAAj+Epi0QEpi0GkAAQGlAAEpC0QEpC0AAD+g");
	this.shape_12.setTransform(225.5,63.5);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#F4E7D7").s().p("ArNGzQkpi0AAj/QAAj+Epi0QEpi0GkAAQGlAAEpC0QEpC0AAD+QAAD/kpC0QkpC0mlAAQmkAAkpi0g");
	this.shape_13.setTransform(225.5,63.5);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f().s("#B53366").ss(3,1,1).p("ASDAAQAAEilTDNQlRDNnfAAQndAAlTjNQlSjNAAkiQAAkhFSjNQFTjNHdAAQHfAAFRDNQFTDNAAEhg");
	this.shape_14.setTransform(225.5,63.525);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#F4E7D7").s().p("AswHvQlSjNAAkiQAAkhFSjNQFSjNHeAAQHfAAFSDNQFSDNAAEhQAAEilSDNQlSDNnfAAQneAAlSjNg");
	this.shape_15.setTransform(225.5,63.525);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f().s("#853054").ss(3,1,1).p("ASDAAQAAEilTDNQlRDNnfAAQndAAlTjNQlSjNAAkiQAAkhFSjNQFTjNHdAAQHfAAFRDNQFTDNAAEhg");
	this.shape_16.setTransform(225.5,63.525);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_13},{t:this.shape_12}]}).to({state:[{t:this.shape_15},{t:this.shape_14}]},1).to({state:[{t:this.shape_15},{t:this.shape_16}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(108.5,-7.9,234,142.9);


(lib.playmusic_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("clicksound");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// button
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#B53366").s().p("AkSFSIgCgBIgDgGIAAgCIAAgCIgBqKQADgJADgDIAFgEIANgBIAKABIAFAAIIBE1IABAAIADADIADAFIACADIgBAHQAAABAAABQAAAAAAABQAAAAAAABQAAAAgBABIgDAFIgEADIgDABIgBABInzFHQgGABgFAEIgKAEIgLACIgBAAQgGAAgEgDg");
	this.shape.setTransform(140.75,85.9778);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#B53366").s().p("AmDHbIgCgBIgEgIIAAgDIAAgDIgBuUQAEgMADgEIAIgGIASgCIAPACIAGAAILTGyIABACIADADIAHAHIABAFIgBAKQABAEgBACIgGAIIgFAEIgEABIgCACIq/HMQgIACgIAFIgMAGIgQADIgDABQgIAAgGgGg");
	this.shape_1.setTransform(146.3,92.6571);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#853054").s().p("AmDHbIgCgBIgEgIIAAgDIAAgDIgBuUQAEgMADgEIAIgGIASgCIAPACIAGAAILTGyIABACIADADIAHAHIABAFIgBAKQABAEgBACIgGAIIgFAEIgEABIgCACIq/HMQgIACgIAFIgMAGIgQADIgDABQgIAAgGgGg");
	this.shape_2.setTransform(146.3,92.6571);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_2}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(106.8,44.6,79.00000000000001,96.1);


(lib.pausemusic_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("clicksound");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// button
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#B53366").s().p("AAyFBIgGgDQgBgDgBgGIAApgIAAgJIADgHQABgBAAAAQAAgBABAAQAAgBAAAAQABAAAAgBIAEgBICLAAIADABIADAAIACABQADACABADIABAEIABACIAAJpIgCAHIgEADIgDABgAjEFBIgGgDQgCgDAAgGIAApgIAAgJIADgHQAAgBABAAQAAgBABAAQAAgBAAAAQABAAAAgBIAEgBICLAAIADABIADAAIACABIAEAFIABAEIABACIAAJpIgCAHIgEADIgDABg");
	this.shape.setTransform(114.3125,81);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#B53366").s().p("ABEGxQgFgBgDgDQgCgEgBgIIAAs2IAAgKIAEgLQACgEACgBIAGgBIC7AAIAEAAIAFAAIACADQAEACABADIACAGIABADIAANCQgBAGgBADQgCACgEACIgEABgAkJGxQgFgBgDgDQgCgEAAgIIAAs2QgBgIABgCQAAgDADgIQACgEADgBIAFgBIC8AAIADAAIAFAAIACADIAFAFIACAGIABADIAANCIgCAJQgCACgEACIgDABg");
	this.shape_1.setTransform(114.325,81.05);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#853054").s().p("ABEGxQgFgBgDgDQgCgEgBgIIAAs2IAAgKIAEgLQACgEACgBIAGgBIC7AAIAEAAIAFAAIACADQAEACABADIACAGIABADIAANCQgBAGgBADQgCACgEACIgEABgAkJGxQgFgBgDgDQgCgEAAgIIAAs2QgBgIABgCQAAgDADgIQACgEADgBIAFgBIC8AAIADAAIAFAAIACADIAFAFIACAGIABADIAANCIgCAJQgCACgEACIgDABg");
	this.shape_2.setTransform(114.325,81.05);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#853054").s().p("AlsISIAAwjILZAAIAAQjg");
	this.shape_3.setTransform(113.5,81.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_2}]},1).to({state:[{t:this.shape_3}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(77,28.1,73,106);


(lib.go_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("clicksound");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// go
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#B53366").s().p("AiiD6QhFheAAioQAAhTAehMQAdhMA1gwQA1gwBKAAQBaAABDBkQBDBlAACKQAACbhCBhQhCBghnAAQhZAAhGhegAgfhCQgOATAAAeQAAAeANAUQANATATAAQAUAAANgTQANgUAAgeQAAgegNgTQgNgVgUAAQgSAAgNAVg");
	this.shape.setTransform(251.125,62.975);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#B53366").s().p("AhWFAQgvgYgkg1Qgkg1gOg/QgQg/AAhCQAAiaBHhdQBGhdBwAAQA1AAA7AYQA6AYAwAqIhiDJQg5grgzAAQgiAAgVAZQgVAZAAAoQAABVBBAAIAFAAIAAhoIDIAAIAAFnIgDAAIikAHQhgAAgvgXg");
	this.shape_1.setTransform(199.875,62.875);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#B53366").s().p("Ai4EdQhPhrAAjAQAAheAhhXQAihWA8g3QA9g3BUAAQBmAABNBzQBMByAACdQAACxhLBuQhLBuh2AAQhlAAhPhrgAgkhMQgQAXAAAiQAAAiAPAWQAPAWAWAAQAXAAAOgVQAPgXAAgiQAAgigPgXQgOgXgXAAQgVAAgPAXg");
	this.shape_2.setTransform(255.525,62.525);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#B53366").s().p("AhiFrQg2gbgog7Qgpg9gRhHQgRhIAAhMQAAivBQhqQBPhqCBAAQA8AABCAcQBDAbA2AwIhvDkQhBgwg6AAQgmgBgYAdQgZAdAAAtQAABhBLAAIAFAAIAAh2IDkAAIAAGYIgDAAIi8AIQhtAAg1gbg");
	this.shape_3.setTransform(197.225,62.4);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#853054").s().p("Ai4EdQhPhrAAjAQAAheAhhXQAihWA8g3QA9g3BUAAQBmAABNBzQBMByAACdQAACxhLBuQhLBuh2AAQhlAAhPhrgAgkhMQgQAXAAAiQAAAiAPAWQAPAWAWAAQAXAAAOgVQAPgXAAgiQAAgigPgXQgOgXgXAAQgVAAgPAXg");
	this.shape_4.setTransform(255.525,62.525);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#853054").s().p("AhiFrQg2gbgog7Qgpg9gRhHQgRhIAAhMQAAivBQhqQBPhqCBAAQA8AABCAcQBDAbA2AwIhvDkQhBgwg6AAQgmgBgYAdQgZAdAAAtQAABhBLAAIAFAAIAAh2IDkAAIAAGYIgDAAIi8AIQhtAAg1gbg");
	this.shape_5.setTransform(197.225,62.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_3},{t:this.shape_2}]},1).to({state:[{t:this.shape_5},{t:this.shape_4}]},1).wait(2));

	// oval
	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("#B53366").ss(3,1,1).p("AP3AAQAAD/kpC0QkpC0mlAAQmkAAkpi0Qkpi0AAj/QAAj+Epi0QEpi0GkAAQGlAAEpC0QEpC0AAD+g");
	this.shape_6.setTransform(225.5,63.5);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#F4E7D7").s().p("ArNGzQkpi0AAj/QAAj+Epi0QEpi0GkAAQGlAAEpC0QEpC0AAD+QAAD/kpC0QkpC0mlAAQmkAAkpi0g");
	this.shape_7.setTransform(225.5,63.5);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f().s("#B53366").ss(3,1,1).p("ASDAAQAAEilTDNQlRDNnfAAQndAAlTjNQlSjNAAkiQAAkhFSjNQFTjNHdAAQHfAAFRDNQFTDNAAEhg");
	this.shape_8.setTransform(225.5,63.525);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#F4E7D7").s().p("AswHvQlSjNAAkiQAAkhFSjNQFSjNHeAAQHfAAFSDNQFSDNAAEhQAAEilSDNQlSDNnfAAQneAAlSjNg");
	this.shape_9.setTransform(225.5,63.525);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f().s("#853054").ss(3,1,1).p("ASDAAQAAEilTDNQlRDNnfAAQndAAlTjNQlSjNAAkiQAAkhFSjNQFTjNHdAAQHfAAFRDNQFTDNAAEhg");
	this.shape_10.setTransform(225.5,63.525);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6}]}).to({state:[{t:this.shape_9},{t:this.shape_8}]},1).to({state:[{t:this.shape_9},{t:this.shape_10}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(108.5,-7.9,234,142.9);


(lib.Music = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.pausemusic_btn = new lib.pausemusic_btn();
	this.pausemusic_btn.name = "pausemusic_btn";
	this.pausemusic_btn.setTransform(10.3,0.65,0.2524,0.2024,0,0,0,119,84.2);
	new cjs.ButtonHelper(this.pausemusic_btn, 0, 1, 2, false, new lib.pausemusic_btn(), 3);

	this.playmusic_btn = new lib.playmusic_btn();
	this.playmusic_btn.name = "playmusic_btn";
	this.playmusic_btn.setTransform(-9,0.15,0.1901,0.1901,0,0,0,140.5,86.8);
	new cjs.ButtonHelper(this.playmusic_btn, 0, 1, 2, false, new lib.playmusic_btn(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.playmusic_btn},{t:this.pausemusic_btn}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Music, new cjs.Rectangle(-15.4,-8.7,31.5,19.1), null);


(lib.IngredientList_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// icons
	this.instance = new lib.flour2_gr("synched",0);
	this.instance.setTransform(428.65,181.6,0.2891,0.2891,0,0,0,336.2,146.8);

	this.instance_1 = new lib.frosting1_gr("synched",0);
	this.instance_1.setTransform(365.2,233.75,0.675,0.675,0,0,0,89.4,55.1);

	this.instance_2 = new lib.sugar1_gr("synched",0);
	this.instance_2.setTransform(356.9,293.1,0.3987,0.3987,0,0,0,206.3,97.7);

	this.instance_3 = new lib.eggs3_gr("synched",0);
	this.instance_3.setTransform(435.6,276.4,0.3763,0.3763,0,0,0,125.3,127.5);

	this.instance_4 = new lib.milk_gr("synched",0);
	this.instance_4.setTransform(340.45,156.85,0.1756,0.1756,0,0,0,343.1,241.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	// texandline
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AANBqIAAgCQAAgmgHgTQgGgUgNAAIgBAAIAABPIhAAAIAAjTIBAAAQAgAAALACQAMADAIAHQAIAIAFANQAFAOAAAPQAAAggQAQQAYAmAEA/gAgOgUIABAAQAKgBADgFQAEgEAAgMQAAgTgRgBIgBAAg");
	this.shape.setTransform(273.475,205.7);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AAgBqIgIgkIguAAIgIAkIhBAAIA0jTIBaAAIAxDTgAgKAUIAWAAIgLgzg");
	this.shape_1.setTransform(253.825,205.7);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AgaBmQgPgIgMgRQgLgRgFgUQgFgUAAgUQAAgxAWgdQAWgeAkAAQARAAASAIQASAHAQAOIgfA/QgTgNgQAAQgKAAgGAIQgHAIAAANQAAAaAUAAIACAAIAAggIBAAAIAABxIgBAAIg1ACQgeAAgOgHg");
	this.shape_2.setTransform(235.3,205.625);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#000000").s().p("AgfBiQgQgLgIgRQgJgRgEgVQgDgUAAgnIAAhPIBAAAIAABiQAAALACAHQABAFAEAAQAFAAABgGQACgHAAgTIAAhZIBAAAIAABPQAAAggCAQQgBAPgGASQgFAQgKANQgKAMgMAGQgNAHgNAAQgPgBgQgJg");
	this.shape_3.setTransform(217.575,205.85);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#000000").s().p("AhDBeIAQhHQAHAPAKAKQAKAJAJAAQAFAAADgEQADgDAAgFQAAgFgCgDQgDgEgEgDIgQgKQgQgKgIgNQgIgNAAgVQAAhIBFAAQAfAAAbAPIgQBDQgIgPgJgIQgKgJgJABQgFAAgDACQgDADAAAFQAAAHAEADQADAFAPAIQAQAJAIAHQAJAIAFALQAFAMAAAQQAABIhFAAQgjAAgfgQg");
	this.shape_4.setTransform(201.225,205.65);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#000000").s().p("AhHBqIAAjTIA+AAQAhAAAOAFQAPAEAKASQAJASAAAZQAAAggOAUQgOAUgVAAQgOAAgQgTIAABYgAgHgNIABAAIADAAQAHAAAFgGQAEgGAAgMQAAgNgEgEQgFgFgKgBIgBAAg");
	this.shape_5.setTransform(175.625,205.7);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#000000").s().p("AgfBiQgQgLgIgRQgJgRgEgVQgDgUAAgnIAAhPIBAAAIAABiQAAALACAHQABAFAEAAQAFAAABgGQACgHAAgTIAAhZIBAAAIAABPQAAAggCAQQgBAPgGASQgFAQgKANQgKAMgMAGQgNAHgNAAQgPgBgQgJg");
	this.shape_6.setTransform(157.775,205.85);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#000000").s().p("AguBPQgWgeAAgvQAAgvAXggQAWggAiAAQAPAAAQAHQAQAGALALIgaBKQgLgFgPAAQgUAAAAAPQAAAHAFAFQAFAEAKAAQAPAAALgIIAaBRQgIAIgQAHQgQAHgTAAQghAAgXgfg");
	this.shape_7.setTransform(141.375,205.65);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#000000").s().p("AgfBsIAAi7IA/gcIAADXg");
	this.shape_8.setTransform(114,205.5);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#000000").s().p("AgaBjQgPgHgLgRQgLgQgFgUQgEgTAAgUQAAgwAVgdQAWgdAjABQAQAAASAHQASAHAPANIgeA/QgSgNgQAAQgKgBgGAIQgHAIAAANQABAZATAAIACAAIAAggIA+AAIAABvIgBAAIgzADQgdAAgPgIg");
	this.shape_9.setTransform(243.05,302.25);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#000000").s().p("AAXBoIgehAIAAA/Ig+AAIAAjOIAtAAIAgBFIAAhFIA+AAIAADPg");
	this.shape_10.setTransform(225.575,302.375);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#000000").s().p("AgeBoIAAjOIA9AAIAADOg");
	this.shape_11.setTransform(211.825,302.3);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#000000").s().p("AgeBoIAAh7IggAAIAAhTIB8AAIAABTIgfAAIAAB7g");
	this.shape_12.setTransform(199.85,302.3);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#000000").s().p("AhBBcIAPhGQAHAPAKAJQAKAJAJAAQAEAAADgDQADgDAAgFQAAgFgCgEIgHgGIgPgKQgQgKgHgMQgIgNAAgUQAAhGBCAAQAfAAAaAOIgQBCQgHgPgJgIQgJgIgKAAQgFAAgDADQgCADAAAEQAAAHADADQAFAEAOAJQAPAIAIAIQAJAHAEALQAFALAAAQQAABGhDAAQgiAAgegPg");
	this.shape_13.setTransform(185.5,302.275);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#000000").s().p("AgyBOQgVgdAAg0QAAgaAJgXQAJgYARgPQAQgPAWAAQAcAAAVAfQAVAfAAArQAAAwgUAeQgVAeggAAQgbAAgWgdgAgJgUQgEAGAAAKQAAAIAEAGQAEAGAFAAQAGAAAEgGQAEgGAAgIQAAgKgEgGQgEgGgGAAQgFAAgEAGg");
	this.shape_14.setTransform(169.825,302.275);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#000000").s().p("AAMBoIAAgCQABglgIgTQgFgTgNAAIgBAAIAABNIg+AAIAAjOIA+AAQAfAAAMABQAKADAIAHQAJAIAFAOQAEANAAAPQAAAfgPAPQAXAlAEA+gAgOgUIABAAQAKAAADgFQAEgFAAgKQAAgUgRAAIgBAAg");
	this.shape_15.setTransform(153.65,302.3);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#000000").s().p("Ag6BoIAAjOIB0AAIAAA0Ig3AAIAAAlIApAAIAAAzIgpAAIAABCg");
	this.shape_16.setTransform(137.45,302.3);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#000000").s().p("AgeBoIAAhbIg2hzIA/AAIAVAvIAWgvIA/AAIg2BzIAABbg");
	this.shape_17.setTransform(267.425,274.2);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#000000").s().p("AANBoIAAgDQgBgkgGgTQgHgTgMAAIgBAAIAABNIg+AAIAAjOIA+AAQAgAAAKACQALACAJAHQAIAIAFANQAFANAAAPQgBAfgPAQQAXAlAEA+gAgOgUIACAAQAJAAADgFQAEgFAAgKQAAgUgRAAIgBAAg");
	this.shape_18.setTransform(251.8,274.2);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#000000").s().p("AAMBoIAAgDQAAgkgGgTQgHgTgMAAIgBAAIAABNIg+AAIAAjOIA+AAQAfAAALACQAMACAHAHQAJAIAFANQAFANgBAPQAAAfgPAQQAXAlAEA+gAgOgUIACAAQAJAAADgFQAEgFAAgKQAAgUgRAAIgBAAg");
	this.shape_19.setTransform(234.05,274.2);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#000000").s().p("Ag5BoIAAjOIBzAAIAAAzIg2AAIAAAaIAmAAIAAAzIgmAAIAAAaIA2AAIAAA0g");
	this.shape_20.setTransform(217.775,274.2);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#000000").s().p("AhIBoIAAjOIBKAAQAagBANAFQAMAFAIAOQAIAOAAATQAAASgEAJQgEAJgKAKQAMAIAFALQAFALAAARQAAAagNAPQgNAQgVAAgAgKA6IACAAQAKAAAEgFQAFgFAAgMQAAgMgFgGQgEgEgLAAIgBAAgAgKgUIABAAQAKgBAEgEQAEgFAAgKQAAgMgEgEQgEgFgKAAIgBAAg");
	this.shape_21.setTransform(201.975,274.2);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#000000").s().p("AAXBoIgWhSIgUBSIguAAIgyjOIA9AAIAQBDIAShDIAqAAIASBDIAPhDIA9AAIgvDOg");
	this.shape_22.setTransform(180.775,274.2);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.f("#000000").s().p("AAfBoIgIgkIgtAAIgIAkIg/AAIAzjOIBYAAIAvDOgAgKATIAWAAIgLgxg");
	this.shape_23.setTransform(160.75,274.2);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.f("#000000").s().p("AAMBoIAAgDQAAgkgGgTQgHgTgMAAIgBAAIAABNIg+AAIAAjOIA+AAQAfAAALACQAMACAHAHQAJAIAFANQAFANgBAPQAAAfgPAQQAXAlAEA+gAgOgUIACAAQAJAAADgFQAEgFAAgKQAAgUgRAAIgBAAg");
	this.shape_24.setTransform(142.7,274.2);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.f("#000000").s().p("AgfBoIAAh7IgeAAIAAhTIB8AAIAABTIggAAIAAB7g");
	this.shape_25.setTransform(126.2,274.2);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.f("#000000").s().p("AhBBcIAPhGQAHAPAKAJQAKAJAIAAQAFAAADgDQADgDAAgFQAAgFgCgEIgHgGIgPgKQgQgKgHgMQgIgNAAgUQAAhGBDAAQAeAAAaAOIgQBCQgHgPgJgIQgJgIgKAAQgEAAgEADQgDADAAAEQAAAHAEADQAFAEAOAJQAPAIAIAIQAIAHAGALQAEALAAAQQAABGhCAAQgkAAgdgPg");
	this.shape_26.setTransform(111.8,274.175);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.f("#000000").s().p("AANBrIAAgCQAAglgHgUQgHgUgNAAIAAAAIAABPIhBAAIAAjVIBBAAQAgAAALACQAMACAIAIQAJAIAFAOQAFAOAAAPQAAAggQAQQAXAnAFA/gAgOgVIABAAQAKAAADgFQAEgFAAgLQAAgUgRAAIgBAAg");
	this.shape_27.setTransform(284.425,241.075);

	this.shape_28 = new cjs.Shape();
	this.shape_28.graphics.f("#000000").s().p("AgfBjQgQgLgJgRQgJgSgDgUQgEgVABgnIAAhRIBAAAIAABkQAAAMABAGQACAFAEAAQAEAAACgGQACgHAAgTIAAhbIBBAAIAABQQgBAigBAPQgBAQgGARQgGARgKAMQgKAMgMAHQgMAHgNAAQgQAAgQgKg");
	this.shape_28.setTransform(265.7,241.225);

	this.shape_29 = new cjs.Shape();
	this.shape_29.graphics.f("#000000").s().p("Ag0BRQgVgeAAg2QAAgaAJgZQAKgZARgPQARgPAWAAQAdgBAWAhQAVAgAAAtQABAwgVAgQgWAeggAAQgdAAgXgdgAgJgVQgFAGAAAKQAAAKAFAFQADAHAGAAQAGAAAEgHQAFgFAAgKQAAgKgFgGQgEgGgGAAQgFAAgEAGg");
	this.shape_29.setTransform(248,241.05);

	this.shape_30 = new cjs.Shape();
	this.shape_30.graphics.f("#000000").s().p("Ag8BrIAAjVIBAAAIAACfIA5AAIAAA2g");
	this.shape_30.setTransform(232.6,241.075);

	this.shape_31 = new cjs.Shape();
	this.shape_31.graphics.f("#000000").s().p("Ag8BrIAAjVIB5AAIAAA2Ig5AAIAAAnIApAAIAAA0IgpAAIAABEg");
	this.shape_31.setTransform(217.75,241.075);

	this.shape_32 = new cjs.Shape();
	this.shape_32.graphics.f("#000000").s().p("AhEBfIAQhIQAHAPAKAKQALAJAJAAQAFABADgEQADgDAAgFQAAgFgDgEQgBgEgGgDIgPgKQgRgKgHgNQgIgOAAgTQAAhKBFABQAfAAAbAOIgQBEQgHgQgKgIQgJgIgKAAQgFAAgDADQgEADAAAEQAAAHAFAEQAEAEAPAJQAPAIAJAJQAIAHAFALQAFAMABAQQAABIhGAAQgkAAgfgPg");
	this.shape_32.setTransform(191.75,241.05);

	this.shape_33 = new cjs.Shape();
	this.shape_33.graphics.f("#000000").s().p("AhIBrIAAjVIA+AAQAiAAAOAFQAPAFAKASQAKASAAAZQAAAggPAUQgNAVgWAAQgPAAgQgTIAABYgAgIgNIABAAIADAAQAIAAAFgGQAEgHAAgLQAAgNgEgFQgFgFgLAAIgBAAg");
	this.shape_33.setTransform(176.35,241.075);

	this.shape_34 = new cjs.Shape();
	this.shape_34.graphics.f("#000000").s().p("AgfBjQgQgLgJgRQgJgSgDgUQgEgVABgnIAAhRIBAAAIAABkQAAAMABAGQACAFAEAAQAEAAADgGQABgHAAgTIAAhbIBBAAIAABQQgBAigBAPQgBAQgGARQgGARgKAMQgKAMgMAHQgNAHgMAAQgQAAgQgKg");
	this.shape_34.setTransform(158.25,241.225);

	this.shape_35 = new cjs.Shape();
	this.shape_35.graphics.f("#000000").s().p("AguBQQgXgfAAgwQAAgvAXggQAXgfAiAAQAQAAAQAFQAQAHALAKIgbBMQgLgGgPAAQgTAAAAAQQgBAHAFAEQAGAFAJAAQAPAAALgHIAbBRQgIAIgQAHQgQAGgUAAQgiAAgWgeg");
	this.shape_35.setTransform(141.7,241.05);

	this.shape_36 = new cjs.Shape();
	this.shape_36.graphics.f("#000000").s().p("Ag6BtIAfg7QAQgfAAgTQAAgKgDgGQgFgGgGAAQgPAAgRAlIABhgQAOgPALgFQAMgHAQAAQAPAAAOALQAPAMAHAVQAHAUAAAZQAAAPgDANQgCAOgIAVQgHAVgDAEIgBACIAbAAIAAAmg");
	this.shape_36.setTransform(113.95,240.9);

	this.shape_37 = new cjs.Shape();
	this.shape_37.graphics.f("#000000").s().p("AhEBgIAQhJQAHAQAJAKQALAJAKAAQAEAAAEgDQADgDAAgGQgBgFgCgEQgCgEgFgDIgQgKQgRgKgIgNQgHgOgBgVQAAhKBGAAQAhAAAbAPIgRBFQgHgQgKgIQgJgIgKAAQgGAAgDADQgCADAAAFQAAAGADAEQAFAEAPAJQAPAJAJAIQAJAIAFALQAGAMgBARQAABKhGAAQglAAgegRg");
	this.shape_37.setTransform(191.7,134.025);

	this.shape_38 = new cjs.Shape();
	this.shape_38.graphics.f("#000000").s().p("AgbBpQgQgIgLgRQgMgSgFgUQgFgVAAgVQAAgyAXgfQAWgeAlAAQARAAAUAIQATAHAPAOIggBCQgTgOgQAAQgLAAgGAIQgIAIAAAOQAAAbAVAAIACAAIAAgiIBBAAIAAB1IAAAAIg2ACQgfAAgPgHg");
	this.shape_38.setTransform(175.35,133.975);

	this.shape_39 = new cjs.Shape();
	this.shape_39.graphics.f("#000000").s().p("AgcBpQgPgIgMgRQgMgSgEgUQgFgVAAgVQAAgyAXgfQAXgeAkAAQARAAATAIQATAHAQAOIggBCQgSgOgRAAQgLAAgGAIQgIAIABAOQgBAbAVAAIABAAIAAgiIBCAAIAAB1IAAAAIg2ACQgfAAgQgHg");
	this.shape_39.setTransform(157.5,133.975);

	this.shape_40 = new cjs.Shape();
	this.shape_40.graphics.f("#000000").s().p("Ag8BtIAAjZIB5AAIAAA3Ig5AAIAAAbIAoAAIAAA2IgoAAIAAAaIA5AAIAAA3g");
	this.shape_40.setTransform(141.2,134.05);

	this.shape_41 = new cjs.Shape();
	this.shape_41.graphics.f("#000000").s().p("Ag3BtIAAhMQALAXASgBQAJAAAEgEQAGgGAAgJQgBgNgGgGQgGgIgLAAQgKAAgOAIIAAglQAKADALABQAMgBAGgGQAHgHAAgMQAAgIgFgGQgFgGgIAAQgIAAgIAGQgIAGgEAMIAAhGIAzAAQAhAAANAPQANAQAAAaQAAARgGAMQgGALgNAJQAaANAAAnQABAVgJAOQgHAOgNAGQgNAEgaAAg");
	this.shape_41.setTransform(114.15,134.05);

	this.shape_42 = new cjs.Shape();
	this.shape_42.graphics.f("#000000").s().p("AANBlIAAgCQAAgigIgSQgHgTgPgBIAABKIg9AAIAAjJIA9AAIAABDQAMAAAJgPQAJgQAAgiIAAgCIA+AAIAAACQAABEgbAeQAfAjAAA/IAAADg");
	this.shape_42.setTransform(255.075,170.25);

	this.shape_43 = new cjs.Shape();
	this.shape_43.graphics.f("#000000").s().p("Ag4BlIAAjJIA8AAIAACXIA1AAIAAAyg");
	this.shape_43.setTransform(239.175,170.25);

	this.shape_44 = new cjs.Shape();
	this.shape_44.graphics.f("#000000").s().p("AgdBlIAAjJIA7AAIAADJg");
	this.shape_44.setTransform(226.875,170.25);

	this.shape_45 = new cjs.Shape();
	this.shape_45.graphics.f("#000000").s().p("AAXBlIAAhlIgXAnIgWgnIAABlIg9AAIAAjJIA7AAIAYAqIAZgqIA7AAIAADJg");
	this.shape_45.setTransform(211.775,170.25);

	this.shape_46 = new cjs.Shape();
	this.shape_46.graphics.f("#000000").s().p("Ag4BlIAAjJIBxAAIAAAzIg1AAIAAAYIAlAAIAAAzIglAAIAAAZIA1AAIAAAyg");
	this.shape_46.setTransform(185.25,170.25);

	this.shape_47 = new cjs.Shape();
	this.shape_47.graphics.f("#000000").s().p("Ag4BlIAAjJIA8AAIAACXIA1AAIAAAyg");
	this.shape_47.setTransform(171.525,170.25);

	this.shape_48 = new cjs.Shape();
	this.shape_48.graphics.f("#000000").s().p("AgwBMQgVgdAAgyQAAgZAJgXQAJgXAQgPQAQgOAVAAQAcAAAUAeQAUAeAAAqQAAAvgUAdQgUAdgeAAQgbAAgVgcgAgJgTQgEAFAAAKQAAAIAEAGQAEAGAFAAQAGAAAEgGQAEgGAAgIQAAgKgEgFQgEgHgGAAQgFAAgEAHg");
	this.shape_48.setTransform(155.775,170.225);

	this.shape_49 = new cjs.Shape();
	this.shape_49.graphics.f("#000000").s().p("AAQBlIAAhLIgeAAIAABLIg9AAIAAjJIA9AAIAABKIAeAAIAAhKIA8AAIAADJg");
	this.shape_49.setTransform(138.125,170.25);

	this.shape_50 = new cjs.Shape();
	this.shape_50.graphics.f("#000000").s().p("AAWBlIgWhQIgSBQIgtAAIgxjJIA7AAIAQBCIARhCIApAAIASBCIAPhCIA7AAIguDJg");
	this.shape_50.setTransform(116.95,170.25);

	this.shape_51 = new cjs.Shape();
	this.shape_51.graphics.f().s("#666666").ss(1,1,1).p("AvrnoIfXAAAvrh2IfXAAAvrDtIfXAAAvrNEIfXAAAvrtDIfXAA");
	this.shape_51.setTransform(200.55,233.975);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_51},{t:this.shape_50},{t:this.shape_49},{t:this.shape_48},{t:this.shape_47},{t:this.shape_46},{t:this.shape_45},{t:this.shape_44},{t:this.shape_43},{t:this.shape_42},{t:this.shape_41},{t:this.shape_40},{t:this.shape_39},{t:this.shape_38},{t:this.shape_37},{t:this.shape_36},{t:this.shape_35},{t:this.shape_34},{t:this.shape_33},{t:this.shape_32},{t:this.shape_31},{t:this.shape_30},{t:this.shape_29},{t:this.shape_28},{t:this.shape_27},{t:this.shape_26},{t:this.shape_25},{t:this.shape_24},{t:this.shape_23},{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	// holes
	this.shape_52 = new cjs.Shape();
	this.shape_52.graphics.f().s("#000000").ss(5,1,1).p("AVZAaIAAhCAZzAaIAAhCAIsAeIAAhEAMuAaIAAhEARJAcIAAhGAAEAdIAAhCAkLAdIAAhEAEcAdIAAhCAsoAfIAAhCAxDAgIAAhFAolAeIAAhFA5yArIAAgPIAAhCA1SAeIAAhE");
	this.shape_52.setTransform(282.95,93.55);

	this.shape_53 = new cjs.Shape();
	this.shape_53.graphics.f("#000000").s().p("AEBBAQgUgJgKgRQgKgRABgVQACgUANgQQANgPAVgGQAVgFATAIQATAIALASQAMATgCATQgCAUgOARQgOAQgUAFQgHABgHAAQgNAAgNgFgAgVA+QgUgJgLgRQgKgRACgUQACgVAMgQQANgPAVgGQAUgFATAIQATAIAMASQALATgCATQgBAUgOARQgOAQgUAFQgHABgHAAQgMAAgNgFgAtEA+QgUgJgKgRQgKgRABgUQACgVANgQQANgPAVgGQAVgFATAIQATAIALASQAMATgCATQgCAUgOARQgOAQgUAFQgHABgHAAQgNAAgNgFgAZYA8QgUgIgKgSQgKgRABgUQACgVANgPQANgQAVgFQAVgFATAHQATAIALATQAMASgCATQgCAVgOAQQgOARgUAEQgHACgHAAQgNAAgNgGgAklA8QgUgJgLgRQgKgRACgUQACgVAMgQQANgPAVgGQAVgFATAIQATAIAMASQALATgCATQgBAUgOARQgOAQgUAFQgHABgHAAQgNAAgNgFgAxfA8QgUgJgKgRQgKgRABgUQACgVANgQQANgPAVgGQAHgCAIAAQANAAAMAFQATAIALASQAMATgCATQgCAUgOARQgOAQgUAFQgHABgHAAQgNAAgNgFgAU9A6QgUgIgKgSQgKgRABgUQACgVANgPQANgQAVgFQAVgFATAHQATAIALATQAMASgCATQgCAVgOAQQgOARgUAEQgHACgHAAQgNAAgNgGgAIPA6QgUgIgLgSQgKgRACgUQACgVAMgPQANgQAVgFQAJgCAIAAQAMAAALAEQATAIAMATQALASgCATQgBAVgOAQQgOARgUAEQgHACgHAAQgNAAgNgGgApAA6QgUgJgLgRQgKgRACgUQACgVAMgQQANgPAVgGIAPgCQANAAAMAFQATAIAMASQALATgCATQgBAUgOARQgOAQgUAFQgHABgHAAQgNAAgNgFgA1vA6QgUgJgKgRQgKgRABgUQACgVANgQQANgPAVgGQAIgCAIAAQAMAAAMAFQATAIALASQAMATgCATQgCAUgOARQgOAQgUAFQgHABgHAAQgNAAgNgFgAQtA4QgUgIgKgSQgKgRABgUQACgVANgPQANgQAVgFIANgCIABAAQANgBANAFQATAIALATQAMASgCATQgCAVgOAQQgOARgUAEQgHACgHAAQgNAAgNgGgA6KA4QgUgJgKgRQgKgRABgUQACgVANgQQANgPAVgGIALgCIAAAPIAAgPQAPgBAOAGQATAIALASQAMATgCATQgCAUgOARQgOAQgUAFQgHABgHAAQgNAAgNgFgAMSA2QgUgIgKgSQgKgRABgUQACgVANgPQANgQAVgFQAIgCAHAAQANAAAMAEQATAIALATQAMASgCATQgCAVgOAQQgOARgUAEQgHACgHAAQgNAAgNgGgA51hDg");
	this.shape_53.setTransform(283.28,103.0775);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_53},{t:this.shape_52}]}).wait(1));

	// paper
	this.shape_54 = new cjs.Shape();
	this.shape_54.graphics.f().s("#252525").ss(1,1,1).p("AejACQAAAAAAAAAejgCIAIAAAefgBIAEgBA+qADIAVAAMA8xgAFIAHAA");
	this.shape_54.setTransform(281.875,87.45);

	this.shape_55 = new cjs.Shape();
	this.shape_55.graphics.f().s("#000000").ss(1,1,1).p("Afpy4MAAAAl7A/ozCMAAAAlz");
	this.shape_55.setTransform(283.5,212.8875);

	this.shape_56 = new cjs.Shape();
	this.shape_56.graphics.f("#F4F4F4").s().p("A4TTzIgUgMQgMgGgJgBQgLgCgVAEQgWAEgKgBQgJgBgLgEIgTgHQgYgGgeAJQgVAGgfAQQgYAMgNABQgQAAgRgJQgKgFgUgPQgTgOgMgFQgJgFgWgHQgVgHgKgFQgVgMgBgQQAAgEgCgCIgBAAMAAAgl0IACAAQABAAAAAAQABAAAAgBQABAAAAAAQAAgBAAAAIAAgGQAAgFAEgFQAHgHAQgBIAegBIADgDIABgCMA8wgAGIADACIAFADIAAAAIALgBQAMAAAJACQAJACAPAIQAWALADANQAAAHADABIABABMAAAAl7QgDABgCAIQgDASgIAMQgLAPgOADQgHACgVgCQgNgBgYACQgaACgLgBQgSAAghgGQgkgHgQAAQgOAAgHACQgGACgJAFIgOAJQgZAPgfgEQgfgDgWgTIgNgJQgFgDgIAAQgKAAgJAFQgHAEgLALQgLALgGAEQgRALgYgFQgLgCgcgMQg1gZgagRIgUgOQgMgHgLgBQgJgBgLAEIgTALQgHAEgXAGQhFAPgkARIgWAKQgNAEgKgBQgKgCgLgHIgSgOQgjgdgfAIQgHACgNAHQgNAHgHACQgIACgKABIgTABQgOADgbAPQgbAOgQABIgHACIgBgBIg1gVQgUgHgKgHIgSgQQgLgKgIgDQgWgIglAUQgOAIgIAAQgIAAgNgIQgQgJgGgCQgXgGgbAcQgPAOgHAFQgNAKgMABQgKABgOgFIgZgHQgOgCgUAEQgVAGgNAGQgRAGgHgCQgGgCgFgGIgJgKQgLgMgSgFQgMgEgXgCIhagMQgrgHgVgFQgkgIgZgOIgXgNQgOgGgLABQgMACgOAMIgZAUQgRAKgeADQgmADgKACIglAIIglAKQgsALgggIQgLgbgSgDQgKgCgTAKIggARQgJAFgGAAQgNAAgKgWQgLgWgNgIQgWgKgHgKIgEgHQgEgEgCAAQgFgBgGAFQgQAPgdAjQgeAfglATIgCACIgEgBQgMgBgPgPQgTgRgIgDIgXgHIgKgEQgGgCgEABQgHACgHAIIgmAvIhSgZQgUgFgJABQgIABgQAJIgiATQgMAHgGABQgGABgIgBIgOgDIgUgDQgMgCgIgEQgHgDgIgHIgPgLQgOgKgegJIhPgYQgOgEgKABQgHABgPAMIghAcQgaAWgRACQgMACgRgGIgbgLQgOgFgigJQgVgFgJAHIgJAOQgIALgVAJQgXALgPACIgJABQgaAAgegTg");
	this.shape_56.setTransform(283.5,215.724);

	this.shape_57 = new cjs.Shape();
	this.shape_57.graphics.f("#000000").s().p("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");
	this.shape_57.setTransform(283.475,215.9187);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_57},{t:this.shape_56},{t:this.shape_55},{t:this.shape_54}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(80.1,86.2,406.9,259.2);


(lib.flour1_gr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// cups
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AgnA7IAAh1IAiAAQASAAAIADQAIADAGAKQAFAJAAAOQAAASgIAKQgHAMgMAAQgIAAgJgLIAAAxgAgEgHIABAAIACAAQADAAADgDQACgEAAgGQAAgHgCgDQgDgCgFAAIgBAAg");
	this.shape.setTransform(410.075,217.525);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AgRA2QgIgGgFgJQgFgKgCgLQgCgLAAgWIAAgsIAkAAIAAA3IAAAJQABABAAABQAAAAABAAQAAABABAAQAAAAAAAAQABAAAAAAQABAAAAgBQABAAAAgBQAAAAAAgBQABgEAAgKIAAgyIAkAAIAAAsIgBAbQgBAIgDAKQgDAJgGAHQgFAGgHAEQgHAEgHAAQgIAAgJgGg");
	this.shape_1.setTransform(400.225,217.625);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AgZAsQgMgRAAgaQAAgaAMgRQANgSASAAQAJAAAIAEQAJADAGAGIgOApQgGgDgJAAQgKAAAAAJQAAADACADQADACAFAAQAJAAAGgEIAOAtQgEAEgJAEQgJAEgLAAQgRAAgNgRg");
	this.shape_2.setTransform(391.125,217.525);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#000000").s().p("AgRA8IAAhnIAjgQIAAB3g");
	this.shape_3.setTransform(375.975,217.425);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#B3B5B6").s().p("AmNDsIgqgBQgZgCgzgHQg1gHgZgIQgWgIgPgIQgIgGgPgNQgTgRgHgKQgPgWgHgjQgGgfgDhJIgDhiQgDhAABgnQANAJAVAGQARAEAfAFIBzARIBQAKIBWAFQAnACAnABQAsABBXgDIA8gDQAtgEBIgOQAkgHAUgFQAXgIAOgKQAAAugDAvIgCAiIgVCVQgGAjgEANQgGAagPARQgKALgRAKQgyAhhKAMQgyAJhTABIhSABIhlgBgACfi/IgCAAIABgVIAAgYIAGAAIFlAAQA5AAAdACQAvACAlAIQAVADAFALQgIAMgbABQiBAJkBAAQhcAAgtgDgAJrjlQgGAAgFADQgDABgCACIAAAJIADAHIACADQAEAFAHABIAQABIAWgBQAOgBAGgCQAHgDADgDQACgBABgFQAAgDgCgCIgFgEIgGgDQgGgCgJgBIgkgCg");
	this.shape_4.setTransform(422.45,215.6);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#7F8082").s().p("AAmBCQgzAAhdgFQgkgCgSgDIgigGIgogFIhrgPQgZgEgLgDQgUgGgMgLQgGgEgBgEQgBgGAFgHQAHgIAOgGQAmgSAogDIAvgCQAUgBAkgFQAngFASgBQAfgCAzACIBSADIAzAAQAUAAAkAEIA4AFIAxABQBSAEBgAiQALAEADAFQAEAFgDAEQgDADgGAEIgGAJQgDADgIADIgiAKIgVAFQhLAQhMAFQgyADg7AAIglAAg");
	this.shape_5.setTransform(392.8406,190.4423);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#000000").s().p("AnWEvIg0gHQgmgGgVgFIgGgCQgtgNgjgeQglgfgOgqQgFgQgCgMQgGgdgCgyQgGiSgChqQAAgNAEgFQgCgPAKgQQAIgMAUgMQAigUA2gGQA8gDAfgEIA8gHQAfgDBAACIDAAGQAoAFAUABIAuABQBMADBgAeQAUAGAKAGQAPAJAFAMIADABQAFADABAHIAGAAIFlAAQA5AAAdABQAwACAlAIQAWAEAKAHQAHAFAEAIQAEAIgBAIQgCALgMAIQgJAFgOADQgTADgdABQhqAFj6ACQhgAAgrgDQgBA4gCAXQgEAqgNBTIgGAqQgGAjgFATQgJAegQASQgKAMgRAMQgnAbgzAQQgcAIgfAFQg5AJhoAAIhyAAQhQAAgngEgArDhGIADBhQADBKAGAfQAGAjAPAWQAIAKATARQAPANAIAGQAOAIAXAIQAZAIA1AHQAzAHAZACIAqABQBuACBJgCQBTgBAygIQBKgNAyghQARgKAKgLQAOgRAHgZQAEgNAFgkIAViUIADgjQACguABgvQgPAKgWAIQgUAGgkAGQhIAOgtAEIg8ADQhXADgsgBQgnAAgngDIhWgFIhQgKIhzgRQgggEgRgFQgUgGgOgJQAAAnADBAgAm8kUQgRABgnAFQglAFgUABIgvACQgnAEgnARQgNAHgHAIQgGAGACAHQABAEAFAFQANAKATAGQALAEAZAEIBsAPIAnAEIAiAGQASADAkACQBeAFA0ABQBQABBBgFQBNgFBKgQIAVgEIAhgKQAIgDADgEIAGgJQAHgDACgEQAEgEgEgGQgEgFgLgEQhfghhSgEIgwgCIg5gFQgjgDgVgBIgzAAIhSgDIgvgBIgkABgACjisIAAAVIACAAQAtAEBcAAQEBgBCBgIQAbgCAHgMQgFgKgUgEQglgIgwgCQgcgCg5AAIlmAAIgGAAgAJxieQgIgBgDgFIgDgDIgCgGIAAgKQACgCADgBQAFgDAGAAIAGAAIAlABQAIABAHACIAGADIAFAEQACADAAADQgBAEgCACQgDADgHACQgHACgNABIgWABgAJrixQABAGAFACQADACAHAAQAJAAASgCIAQgCIAFgCQgJgFgQAAIgZgBQgIAAgGACg");
	this.shape_6.setTransform(421.8955,211.56);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	// flour
	this.instance = new lib.justflour_gr("synched",0);
	this.instance.setTransform(275.55,146.7,1,1,0,0,0,99.4,108.2);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(176.2,38.5,319.90000000000003,216.4);


(lib.sugar3_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("clicksound");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// sugar
	this.instance = new lib.sugar3_gr("synched",0);
	this.instance.setTransform(271,135.1,0.8377,0.8377,0,0,0,207.2,97.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:208.2,regY:98.4,scaleX:1.0089,scaleY:1.0101,x:276,y:135.8},0).wait(1).to({startPosition:0},0).wait(2));

	// circle
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.6)").s().p("ApYJZQj5j5AAlgQAAlfD5j5QD5j5FfAAQFgAAD5D5QD5D5AAFfQAAFgj5D5Qj5D5lgAAQlfAAj5j5g");
	this.shape.setTransform(242,135);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.6)").s().p("ArBLDQkkklAAmeQAAmeEkkkQEkklGdAAQGdAAEkElQElEkAAGeQAAGeklElQkkElmdgBQmdABkkklg");
	this.shape_1.setTransform(238.825,135.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_1}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(139,35.1,235.5,199.9);


(lib.sugar2_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("clicksound");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// sugar
	this.instance = new lib.sugar2_gr("synched",0);
	this.instance.setTransform(232.05,133.75,0.8462,0.8462,0,0,0,206.3,97.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:206.6,regY:97.9,scaleX:1.0526,scaleY:1.0526,x:235.15,y:133.8},0).wait(1).to({startPosition:0},0).wait(2));

	// circle
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.6)").s().p("ApYJZQj5j5AAlgQAAlgD5j4QD4j5FgAAQFgAAD5D5QD5D4AAFgQAAFgj5D5Qj5D5lgAAQlgAAj4j5g");
	this.shape.setTransform(201,133);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.6)").s().p("AreLgQkxkxAAmvQAAmuExkwQEwkxGuAAQGvAAEwExQExEwAAGuQAAGvkxExQkwEwmvAAQmuAAkwkwg");
	this.shape_1.setTransform(199,133.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_1}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(95,29.1,242.5,208);


(lib.sugar1_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("clicksound");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// sugar
	this.instance = new lib.sugar1_gr("synched",0);
	this.instance.setTransform(220.1,135.25,0.8669,0.8669,0,0,0,206.3,97.9);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:206.8,regY:98.2,scaleX:1.006,scaleY:1.0038,x:226.5,y:138.55},0).wait(1).to({startPosition:0},0).wait(2));

	// circle
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.6)").s().p("ApYJZQj5j4AAlhQAAlgD5j4QD4j5FgAAQFgAAD5D5QD5D4AAFgQAAFhj5D4Qj5D5lgAAQlgAAj4j5g");
	this.shape.setTransform(189.05,136.05);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.6)").s().p("Aq4K3QkhkfAAmYQAAmXEhkfQEgkhGYABQGYgBEhEhQEhEfAAGXQAAGYkhEfQkhEgmYAAQmYAAkgkgg");
	this.shape_1.setTransform(191.725,139.35);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_1}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(93.2,41,230.90000000000003,196.7);


(lib.wholemik_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("clicksound");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// mik
	this.instance = new lib.milk_gr("synched",0);
	this.instance.setTransform(169.05,125.05,0.3991,0.3991,0,0,0,343.2,241.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regY:241.8,scaleX:0.5138,scaleY:0.5138,y:125.1},0).wait(1).to({startPosition:0},0).wait(2));

	// circle
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.6)").s().p("AqYKZQkTkUAAmFQAAmEETkUQEUkTGEAAQGFAAEUETQETEUAAGEQAAGFkTEUQkUETmFAAQmEAAkUkTg");
	this.shape.setTransform(175,125.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.6)").s().p("AszM0QlUlUAAngQAAngFUlUQFUlTHfAAQHhAAFTFTQFUFUAAHgQAAHglUFUQlTFUnhAAQnfAAlUlUg");
	this.shape_1.setTransform(175,125.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_1}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(59,9.5,232,232);


(lib.skimmilk_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("clicksound");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// mik
	this.instance = new lib.milk3_gr("synched",0);
	this.instance.setTransform(219,123.3,0.4077,0.4077,0,0,0,343.1,241.6);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:343.2,regY:241.4,scaleX:0.5125,scaleY:0.5125,y:123.25},0).wait(1).to({startPosition:0},0).wait(2));

	// circle
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.6)").s().p("AqYKZQkTkUAAmFQAAmEETkUQEUkTGEAAQGGAAESETQEUEUAAGEQAAGFkUEUQkSETmGAAQmEAAkUkTg");
	this.shape.setTransform(225,123.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.6)").s().p("As0M0QlTlTAAnhQAAngFTlUQFVlTHfAAQHhAAFTFTQFUFUAAHgQAAHhlUFTQlTFUnhAAQnfAAlVlUg");
	this.shape_1.setTransform(225,123.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_1}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(109,7.5,232,232);


(lib._1pmilk_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("clicksound");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// mik
	this.instance = new lib.milk2_gr("synched",0);
	this.instance.setTransform(151.65,127.55,0.4118,0.4115,0,0,0,343.5,241.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:343.4,scaleX:0.5116,scaleY:0.5112,x:151.6},0).wait(1).to({startPosition:0},0).wait(2));

	// circle
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.6)").s().p("AqYKYQkTkSAAmGQAAmFETkTQETkTGFAAQGGAAESETQEUETAAGFQAAGGkUESQkSEUmGAAQmFAAkTkUg");
	this.shape.setTransform(159,127.05);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.6)").s().p("As0M0QlTlTAAnhQAAngFTlUQFUlTHgAAQHhAAFTFTQFUFUAAHgQAAHhlUFTQlTFUnhAAQngAAlUlUg");
	this.shape_1.setTransform(159,127.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_1}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(43,11.1,232,232);


(lib.vfrosting_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("clicksound");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// frosting
	this.instance = new lib.frosting3_gr("synched",0);
	this.instance.setTransform(264,113.1,1,1,0,0,0,85.2,58.6);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:85.8,regY:59.1,scaleX:1.2896,scaleY:1.2895,x:265.15,y:111.85},0).wait(1).to({startPosition:0},0).wait(2));

	// circle
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.6)").s().p("AngHhQjHjHAAkaQAAkZDHjIQDHjHEZAAQEaAADHDHQDHDIAAEZQAAEajHDHQjHDIkaAAQkZAAjHjIg");
	this.shape.setTransform(266.825,116.325);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.6)").s().p("ApmJnQj/j/AAloQAAlnD/j/QD+j+FoAAQFoAAEAD+QD+D/AAFnQAAFoj+D/QkAD+loAAQloAAj+j+g");
	this.shape_1.setTransform(265.3,118.55);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_1}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(178.3,31.7,174,173.8);


(lib.sfrosting_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("clicksound");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// frosting
	this.instance = new lib.frosting1_gr("synched",0);
	this.instance.setTransform(256.95,121.05,1,1,0,0,0,89.2,55);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regY:55.1,scaleX:1.3174,scaleY:1.3174,x:257.45,y:121.45},0).wait(1).to({startPosition:0},0).wait(2));

	// circle
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.6)").s().p("AnSHTQjBjBAAkSQAAkRDBjBQDBjBERAAQESAADADBQDCDBAAERQAAESjCDBQjADBkSAAQkRAAjBjBg");
	this.shape.setTransform(259.8,124.25);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.6)").s().p("ApfJgQj8j8AAlkQAAlkD8j7QD7j8FkAAQFkAAD8D8QD8D7AAFkQAAFkj8D8Qj8D8lkAAQlkAAj7j8g");
	this.shape_1.setTransform(263.025,124.075);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_1}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(177.1,38.1,171.9,172);


(lib.cfrosting_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("clicksound");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// frosting
	this.instance = new lib.frosting2_gr("synched",0);
	this.instance.setTransform(246,120.05,1,1,0,0,0,74.2,46.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:74.6,regY:47.2,scaleX:1.3195,scaleY:1.3191,x:244.8,y:119.85},0).wait(1).to({startPosition:0},0).wait(2));

	// circle
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.6)").s().p("Am2G2Qi1i1AAkBQAAkAC1i1QC2i2EAAAQEBAAC1C2QC2C1AAEAQAAEBi2C1Qi1C2kBAAQkAAAi2i2g");
	this.shape.setTransform(245,128.05);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.6)").s().p("Ao4I5QjsjsAAlNQAAlNDsjrQDrjsFNAAQFOAADrDsQDsDrAAFNQAAFNjsDsQjrDslOAAQlNAAjrjsg");
	this.shape_1.setTransform(244.075,125.975);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_1}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(163.6,45.5,161.00000000000003,161);


(lib.flour3_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("clicksound");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// flour
	this.instance = new lib.flour3_gr("synched",0);
	this.instance.setTransform(201.45,114.75,0.5066,0.5066,0,0,0,336.2,146.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:336.1,scaleX:0.6318,scaleY:0.6318,x:201.4},0).wait(1).to({startPosition:0},0).wait(2));

	// circle
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.6)").s().p("AoHIIQjXjYAAkwQAAkvDXjXQDYjYEvAAQExAADXDYQDXDXAAEvQAAEwjXDYQjXDXkxAAQkvAAjYjXg");
	this.shape.setTransform(173.55,121.575);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.6)").s().p("ApqJrQkAkBAAlqQAAlpEAkAQEBkBFqAAQFqAAEBEBQD/EAAAFpQAAFqj/EBQkBEAlqAAQlqAAkBkAg");
	this.shape_1.setTransform(164.45,123.425);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("rgba(255,255,255,0.6)").s().p("ApxJyQkDkEAAluQAAltEDkDQEEkEFtAAQFvAAEDEEQEDEDAAFtQAAFukDEEQkDEDlvAAQltAAkEkDg");
	this.shape_2.setTransform(163.675,123.65);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_2}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(75.2,35.2,227.3,176.89999999999998);


(lib.flour2_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("clicksound");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// flour
	this.instance = new lib.flour2_gr("synched",0);
	this.instance.setTransform(229,115.1,0.5102,0.5102,0,0,0,336.1,146.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regY:146.8,scaleX:0.6227,scaleY:0.6227},0).wait(1).to({startPosition:0},0).wait(2));

	// circle
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.6)").s().p("AoEIEQjVjVAAkvQAAktDVjWQDXjWEtAAQEuAADWDWQDWDWAAEtQAAEvjWDVQjWDWkuAAQktAAjXjWg");
	this.shape.setTransform(198.55,122.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.6)").s().p("ApmJnQj/j/AAloQAAlnD/j/QD/j/FnAAQFoAAD/D/QD/D/AAFnQAAFoj/D/Qj/D/loAAQlnAAj/j/g");
	this.shape_1.setTransform(192.3,123.375);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_1}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(105.3,36.4,223.39999999999998,174);


(lib.flour1_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("clicksound");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// flour
	this.instance = new lib.flour1_gr("synched",0);
	this.instance.setTransform(245.05,115.65,0.5056,0.5056,0,0,0,336.2,146.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:336.3,regY:146.9,scaleX:0.6181,scaleY:0.6181,x:245.1,y:115.7},0).wait(1).to({startPosition:0},0).wait(2));

	// circle
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.6)").s().p("AnyHyQjOjOAAkkQAAkjDOjOQDPjPEjAAQEkAADPDPQDODOAAEjQAAEkjODOQjPDPkkAAQkjAAjPjPg");
	this.shape.setTransform(211.5,121.55);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.6)").s().p("ApfJgQj8j7AAllQAAljD8j7QD9j9FiAAQFkAAD7D9QD9D7AAFjQAAFlj9D7Qj7D8lkAAQliAAj9j8g");
	this.shape_1.setTransform(207.45,124.35);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("rgba(255,255,255,0.6)").s().p("ApiJjQj+j9AAlmQAAlmD+j8QD+j+FkAAQFnAAD8D+QD+D8AAFmQAAFmj+D9Qj8D+lnAAQlkAAj+j+g");
	this.shape_2.setTransform(207.8,123.85);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_2}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(121.3,37.4,222.59999999999997,173);


(lib.eggs3_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("clicksound");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// eggs
	this.instance = new lib.eggs3_gr("synched",0);
	this.instance.setTransform(185.05,132.5,0.8082,0.8082,0,0,0,125.4,127.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:125.5,scaleX:1.0149,scaleY:1.0149,x:185.1},0).wait(1).to({startPosition:0},0).wait(2));

	// circle
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.6)").s().p("AorIrQjTjUgQklQgCgYAAgaQAAlEDljmQDmjmFFAAQFGAADlDmQDmDmAAFEQAAAagCAYQgPEljVDUQjlDmlGAAQlFAAjmjmg");
	this.shape.setTransform(185,133);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.6)").s().p("Aq4K5QkJkLgVlvQgCgfAAggQAAmXEgkgQEhkhGXAAQGZAAEfEhQEhEgAAGXQAAAggCAfQgUFvkLELQkfEgmZAAQmXAAkhkgg");
	this.shape_1.setTransform(185,133);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_1}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(86.5,34.5,197,197);


(lib.eggs2_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("clicksound");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// eggs
	this.instance = new lib.eggs2_gr("synched",0);
	this.instance.setTransform(183.15,130.75,0.8353,0.8353,0,0,0,125.5,127.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:125.6,regY:127.4,scaleX:1.0413,scaleY:1.0413,x:183.2,y:130.7},0).wait(1).to({startPosition:0},0).wait(2));

	// circle
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.6)").s().p("AorIrQjTjUgQklQgCgZAAgZQAAlEDljmQDmjmFFAAQFFAADmDmQDmDmAAFEQAAAZgBAZQgQEljVDUQjmDmlFAAQlFAAjmjmg");
	this.shape.setTransform(183,131);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.6)").s().p("Aq4K4QkJkJgVlwQgCgfAAggQAAmXEgkgQEhkhGXAAQGZAAEfEhQEhEgAAGXQAAAggCAfQgUFwkLEJQkfEhmZAAQmXAAkhkhg");
	this.shape_1.setTransform(183,131);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_1}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(84.5,32.5,197,197);


(lib.eggs1_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("clicksound");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(3));

	// eggs
	this.instance = new lib.eggs1_gr("synched",0);
	this.instance.setTransform(168.05,130.1,0.8246,0.8246,0,0,0,125.4,127.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:125.5,scaleX:1.0481,scaleY:1.0481,x:168.15,y:130.15},0).wait(1).to({startPosition:0},0).to({_off:true},2).wait(1));

	// circle
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.6)").s().p("AorIrQjTjUgQklQgCgZAAgZQAAlEDljmQDmjmFFAAQFFAADmDmQDmDmAAFEQAAAZgBAZQgQEljVDUQjmDmlFAAQlFAAjmjmg");
	this.shape.setTransform(169.05,131.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,255,255,0.6)").s().p("Aq4K5QkJkKgVlwQgCgfAAggQAAmXEgkgQEhkhGXAAQGZAAEfEhQEhEgAAGXQAAAggCAfQgUFwkLEKQkfEgmZAAQmXAAkhkgg");
	this.shape_1.setTransform(169.05,131.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_1}]},1).wait(3));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(70.6,32.6,197.00000000000003,197);


// stage content:
(lib.GRA21172FinalProject = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = false; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {Start:0,Intro:73,Ingredients:341,Eggs:511,Milk:554,MilkGo:570,Sugar:613,SugarGo:629,Flour:672,FlourGo:688,Frosting:731,FrostingGo:747,EggsWrong:793,MilkWrong:823,SugarWrong:853,FlourWrong:883,FrostingWrong:913,Cake:943};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,71,339,503,551,610,669,728,787,818,848,878,908,938,997,1017,1053,1073,1109,1129,1192,1269,1407,1507,1639,1764,1869,2019,2074,2154,2181,2302];
	this.streamSoundSymbolsList[997] = [{id:"eggtaponbowlbutnotcrack",startFrame:997,endFrame:1017,loop:1,offset:0}];
	this.streamSoundSymbolsList[1017] = [{id:"eggcrack3egg",startFrame:1017,endFrame:1053,loop:1,offset:0}];
	this.streamSoundSymbolsList[1053] = [{id:"eggtaponbowlbutnotcrack",startFrame:1053,endFrame:1073,loop:1,offset:0}];
	this.streamSoundSymbolsList[1073] = [{id:"eggcrack3egg",startFrame:1073,endFrame:1109,loop:1,offset:0}];
	this.streamSoundSymbolsList[1109] = [{id:"eggtaponbowlbutnotcrack",startFrame:1109,endFrame:1129,loop:1,offset:0}];
	this.streamSoundSymbolsList[1129] = [{id:"eggcrack3egg",startFrame:1129,endFrame:1192,loop:1,offset:0}];
	this.streamSoundSymbolsList[1192] = [{id:"pouringglassofmilk",startFrame:1192,endFrame:1269,loop:1,offset:0}];
	this.streamSoundSymbolsList[1639] = [{id:"mixingdoughbowlwithspoon01",startFrame:1639,endFrame:1764,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		playSound("sunnydayquiet",-1);
	}
	this.frame_71 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.play_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame number in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('Intro');
		});
	}
	this.frame_339 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.yes_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame number in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('Ingredients');
		});
	}
	this.frame_503 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.go_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame number in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('Eggs');
		});
	}
	this.frame_551 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.eggs1_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame number in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('EggsWrong');
		});
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.eggs2_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame number in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('EggsWrong');
		});
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.eggs3_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('Milk');
		});
	}
	this.frame_610 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.wholemilk_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame number in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('Sugar');
		});
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.onepmilk_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame number in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('MilkWrong');
		});
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.skimmilk_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame number in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('MilkWrong');
		});
	}
	this.frame_669 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.sugar1_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('Flour');
		});
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.sugar2_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('SugarWrong');
		});
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.sugar3_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('SugarWrong');
		});
	}
	this.frame_728 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.flour1_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('FlourWrong');
		});
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.flour2_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('Frosting');
		});
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.flour3_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('FlourWrong');
		});
	}
	this.frame_787 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.vfrosting_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('FrostingWrong');
		});
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.cfrosting_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame number in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('FrostingWrong');
		});
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.sfrosting_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame number in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('Cake');
		});
	}
	this.frame_818 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		
		var _this = this;
		_this.eggsgo_btn.on('click', function(){
			_this.gotoAndPlay('Eggs');
		});
	}
	this.frame_848 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.milkgo_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('MilkGo');
		});
	}
	this.frame_878 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.sugargo_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('SugarGo');
		});
	}
	this.frame_908 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.flourgo_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame number in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('FlourGo');
		});
	}
	this.frame_938 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.frostinggo_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('FrostingGo');
		});
	}
	this.frame_997 = function() {
		var soundInstance = playSound("eggtaponbowlbutnotcrack",0);
		this.InsertIntoSoundStreamData(soundInstance,997,1017,1);
	}
	this.frame_1017 = function() {
		var soundInstance = playSound("eggcrack3egg",0);
		this.InsertIntoSoundStreamData(soundInstance,1017,1053,1);
	}
	this.frame_1053 = function() {
		var soundInstance = playSound("eggtaponbowlbutnotcrack",0);
		this.InsertIntoSoundStreamData(soundInstance,1053,1073,1);
	}
	this.frame_1073 = function() {
		var soundInstance = playSound("eggcrack3egg",0);
		this.InsertIntoSoundStreamData(soundInstance,1073,1109,1);
	}
	this.frame_1109 = function() {
		var soundInstance = playSound("eggtaponbowlbutnotcrack",0);
		this.InsertIntoSoundStreamData(soundInstance,1109,1129,1);
	}
	this.frame_1129 = function() {
		var soundInstance = playSound("eggcrack3egg",0);
		this.InsertIntoSoundStreamData(soundInstance,1129,1192,1);
	}
	this.frame_1192 = function() {
		var soundInstance = playSound("pouringglassofmilk",0);
		this.InsertIntoSoundStreamData(soundInstance,1192,1269,1);
	}
	this.frame_1269 = function() {
		playSound("sugarpour");
	}
	this.frame_1407 = function() {
		playSound("sugarpour");
	}
	this.frame_1507 = function() {
		playSound("sugarpour");
	}
	this.frame_1639 = function() {
		var soundInstance = playSound("mixingdoughbowlwithspoon01",0);
		this.InsertIntoSoundStreamData(soundInstance,1639,1764,1);
	}
	this.frame_1764 = function() {
		playSound("pourcake");
	}
	this.frame_1869 = function() {
		playSound("pourcake");
	}
	this.frame_2019 = function() {
		playSound("clocktick");
	}
	this.frame_2074 = function() {
		playSound("alarmclock");
	}
	this.frame_2154 = function() {
		playSound("frosting");
	}
	this.frame_2181 = function() {
		playSound("frosting");
	}
	this.frame_2302 = function() {
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.replay_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame number in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('Start');
		});
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(71).call(this.frame_71).wait(268).call(this.frame_339).wait(164).call(this.frame_503).wait(48).call(this.frame_551).wait(59).call(this.frame_610).wait(59).call(this.frame_669).wait(59).call(this.frame_728).wait(59).call(this.frame_787).wait(31).call(this.frame_818).wait(30).call(this.frame_848).wait(30).call(this.frame_878).wait(30).call(this.frame_908).wait(30).call(this.frame_938).wait(59).call(this.frame_997).wait(20).call(this.frame_1017).wait(36).call(this.frame_1053).wait(20).call(this.frame_1073).wait(36).call(this.frame_1109).wait(20).call(this.frame_1129).wait(63).call(this.frame_1192).wait(77).call(this.frame_1269).wait(138).call(this.frame_1407).wait(100).call(this.frame_1507).wait(132).call(this.frame_1639).wait(125).call(this.frame_1764).wait(105).call(this.frame_1869).wait(150).call(this.frame_2019).wait(55).call(this.frame_2074).wait(80).call(this.frame_2154).wait(27).call(this.frame_2181).wait(121).call(this.frame_2302).wait(734));

	// Music
	this.movieClip_2 = new lib.Music();
	this.movieClip_2.name = "movieClip_2";
	this.movieClip_2.setTransform(520.3,31.4,1,1,0,0,0,0.4,0.8);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#B53366").s().p("AgUAiQgJgNAAgVQAAgTAKgOQAKgOAOAAQAGAAAHACQAIADAEAFIgLAhQgFgDgHAAQgIAAAAAHQAAADACACQACABAEAAQAHAAAFgDIALAkQgDADgHADQgHADgJAAQgOAAgKgOg");
	this.shape.setTransform(537.625,13.75);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#B53366").s().p("AgNAuIAAhcIAbAAIAABcg");
	this.shape_1.setTransform(529.7,13.75);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#B53366").s().p("AgdApIAHgfQAEAGAEAFQAEAEAEAAQAAAAABAAQAAAAABAAQAAgBABAAQAAAAAAAAQABgBAAAAQAAgBABAAQAAgBAAAAQAAgBAAgBIgBgDIgDgDIgHgFQgIgEgCgFQgEgGAAgJQAAgfAeAAQANAAAMAHIgHAdQgEgHgEgDQgEgEgEAAIgDABQgBAAAAABQAAAAgBABQAAAAAAABQAAAAAAABQAAAAAAABQAAABAAAAQABABAAAAQAAABABAAQACACAGADIALAIQAEADACAFQACAFAAAGQAAAggeAAQgQAAgNgHg");
	this.shape_2.setTransform(522.1,13.75);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#B53366").s().p("AgNArQgGgFgEgHQgFgIgBgJQgBgJAAgQIAAgjIAbAAIAAArIABAHQABABAAAAQAAAAAAABQABAAAAAAQAAAAAAAAQAAAAABAAQAAAAABAAQAAgBAAAAQABgBAAAAIABgLIAAgnIAbAAIAAAiIAAAVQgBAHgCAHQgCAIgFAFQgEAFgFADQgGADgFAAQgHAAgHgEg");
	this.shape_3.setTransform(513,13.825);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#B53366").s().p("AALAuIAAguIgLASIgKgSIAAAuIgcAAIAAhcIAcAAIAKAUIALgUIAcAAIAABcg");
	this.shape_4.setTransform(502.375,13.75);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape},{t:this.movieClip_2}]}).to({state:[]},2537).wait(499));

	// Sounds
	this.movieClip_2_1 = new lib.Music();
	this.movieClip_2_1.name = "movieClip_2_1";
	this.movieClip_2_1.setTransform(520.3,31.4,1,1,0,0,0,0.4,0.8);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#B53366").s().p("AgUAiQgJgNAAgVQAAgTAKgOQAKgOAOAAQAGAAAHACQAIADAEAFIgLAhQgFgDgHAAQgIAAAAAHQAAADACACQACABAEAAQAHAAAFgDIALAkQgDADgHADQgHADgJAAQgOAAgKgOg");
	this.shape_5.setTransform(537.625,13.75);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#B53366").s().p("AgNAuIAAhcIAbAAIAABcg");
	this.shape_6.setTransform(529.7,13.75);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#B53366").s().p("AgdApIAHgfQAEAGAEAFQAEAEAEAAQAAAAABAAQAAAAABAAQAAgBABAAQAAAAAAAAQABgBAAAAQAAgBABAAQAAgBAAAAQAAgBAAgBIgBgDIgDgDIgHgFQgIgEgCgFQgEgGAAgJQAAgfAeAAQANAAAMAHIgHAdQgEgHgEgDQgEgEgEAAIgDABQgBAAAAABQAAAAgBABQAAAAAAABQAAAAAAABQAAAAAAABQAAABAAAAQABABAAAAQAAABABAAQACACAGADIALAIQAEADACAFQACAFAAAGQAAAggeAAQgQAAgNgHg");
	this.shape_7.setTransform(522.1,13.75);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#B53366").s().p("AgNArQgGgFgEgHQgFgIgBgJQgBgJAAgQIAAgjIAbAAIAAArIABAHQABABAAAAQAAAAAAABQABAAAAAAQAAAAAAAAQAAAAABAAQAAAAABAAQAAgBAAAAQABgBAAAAIABgLIAAgnIAbAAIAAAiIAAAVQgBAHgCAHQgCAIgFAFQgEAFgFADQgGADgFAAQgHAAgHgEg");
	this.shape_8.setTransform(513,13.825);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#B53366").s().p("AALAuIAAguIgLASIgKgSIAAAuIgcAAIAAhcIAcAAIAKAUIALgUIAcAAIAABcg");
	this.shape_9.setTransform(502.375,13.75);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.movieClip_2_1}]},1407).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.movieClip_2_1}]},100).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.movieClip_2_1}]},132).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.movieClip_2_1}]},125).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.movieClip_2_1}]},105).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.movieClip_2_1}]},150).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.movieClip_2_1}]},55).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.movieClip_2_1}]},80).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.movieClip_2_1}]},27).to({state:[]},356).wait(499));

	// timerfinger
	this.instance = new lib.timerfinger_gr("synched",0);
	this.instance.setTransform(-25.95,238.85,0.1116,0.1116,-90,0,0,197.2,54.6);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(2004).to({_off:false},0).to({x:130.7},13).wait(2).to({startPosition:0},0).to({rotation:0,x:135.5,y:243.85},13).to({rotation:90,x:130.3,y:248.5},14).to({rotation:180,x:125.65,y:243.5},14).to({rotation:270,x:130.7,y:238.95},14).wait(28).to({startPosition:0},0).to({x:-23.3},10).to({_off:true},1).wait(923));

	// timer
	this.instance_1 = new lib.time_gr("synched",0);
	this.instance_1.setTransform(-26.3,242.65,0.2308,0.2308,0,0,0,261.2,137.6);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(2004).to({_off:false},0).to({x:130.35},13).wait(57).to({startPosition:0},0).to({regX:261.4,regY:137.8,rotation:-8.9262,y:242.7},2).to({regX:261.7,rotation:9.4598},2).to({regX:261.6,regY:137.9,rotation:-8.9878,y:242.65},2).to({regX:261.9,regY:138,rotation:14.4221,y:242.7},2).to({regX:261.8,regY:137.8,rotation:-12.4429,x:130.4,y:242.65},2).to({regX:261.7,regY:138.1,rotation:14.1906,y:242.7},2).to({rotation:-11.2312},2).to({regX:261.9,rotation:8.9766,x:130.45,y:242.75},2).to({regX:261.6,regY:138,rotation:-9.7482,x:130.35},2).to({regX:261.9,regY:138.1,rotation:15.9568,x:130.4},2).to({regX:262,regY:138.3,rotation:-14.0399,y:242.8},2).to({regX:261.9,regY:139.2,scaleX:0.2307,scaleY:0.2307,rotation:-0.5494,x:130.45,y:242.95},2).wait(4).to({rotation:-0.5494},0).to({x:-22.85},10).to({_off:true},1).wait(923));

	// candle3
	this.instance_2 = new lib.candle_gr("synched",0);
	this.instance_2.setTransform(-29.95,149.7,1,1,0,0,0,79.8,0.7);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(2221).to({_off:false},0).to({x:133.25,y:140.75},6).to({_off:true},307).wait(502));

	// candle2
	this.instance_3 = new lib.candle_gr("synched",0);
	this.instance_3.setTransform(-29.95,154.05,1,1,0,0,0,79.8,0.7);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(2215).to({_off:false},0).to({x:108.4,y:134.05},6).to({_off:true},313).wait(502));

	// candle1
	this.instance_4 = new lib.candle_gr("synched",0);
	this.instance_4.setTransform(-32.2,156.3,1,1,0,0,0,79.9,0.6);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(2209).to({_off:false},0).to({x:81.15,y:140.65},6).to({_off:true},319).wait(502));

	// frosting
	this.instance_5 = new lib.strawberryfrosting_gr("synched",0);
	this.instance_5.setTransform(-33.75,162,0.7817,0.7817,0,0,0,-0.1,0.1);
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(2141).to({_off:false},0).to({x:127.6,y:169.35},13).to({x:110.3,y:183.85},4).to({x:78.65,y:189.2},4).to({x:53.65,y:181.5},4).to({x:34.95,y:172.25},4).to({x:117.3,y:124.6},11).to({x:99.95,y:129.9},4).to({x:73.95},4).to({x:53.65},4).to({regX:0.1,rotation:-29.9987,x:255.85,y:246.35},14).to({_off:true},327).wait(502));

	// cakelayer2
	this.instance_6 = new lib.cakelayer2_gr("synched",0);
	this.instance_6.setTransform(-53.1,176.8,0.8414,0.8414,0,0,0,97.7,58.9);
	this.instance_6._off = true;

	this.instance_7 = new lib.cakelayer2frosted_gr("synched",0);
	this.instance_7.setTransform(108.1,178.5,0.8372,0.8372,0,0,0,62.1,76.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_6}]},2129).to({state:[{t:this.instance_6}]},12).to({state:[{t:this.instance_7}]},52).to({state:[]},341).wait(502));
	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(2129).to({_off:false},0).to({x:107.45,y:178.1},12).to({_off:true},52).wait(843));

	// cakelayer1
	this.instance_8 = new lib.cakelayer1_gr("synched",0);
	this.instance_8.setTransform(-61.25,224.9,0.7956,0.7956,0,0,0,110,65.3);
	this.instance_8._off = true;

	this.instance_9 = new lib.cakelayer1frosted_gr("synched",0);
	this.instance_9.setTransform(107.4,226.25,0.78,0.78,0,0,0,102.5,40.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_8}]},2114).to({state:[{t:this.instance_8}]},14).to({state:[{t:this.instance_9}]},42).to({state:[]},364).wait(502));
	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(2114).to({_off:false},0).to({x:108.1},14).to({_off:true},42).wait(866));

	// cakebatter
	this.instance_10 = new lib.liquidmilk_gr("synched",0);
	this.instance_10.setTransform(222.5,188.6,0.0528,0.0339,0,-29.9816,-13.992,141.3,95.5);
	this.instance_10._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(1758).to({_off:false},0).to({regX:142.2,regY:97.7,scaleX:0.0515,scaleY:0.1244,skewX:-29.9793,skewY:-39.7795,x:230.75,y:201.75},10).wait(12).to({startPosition:0},0).to({regX:139.8,regY:89.1,scaleY:0.0072,skewX:-29.9411,x:239.35,y:214.7},13).to({_off:true},1).wait(68).to({_off:false,regX:141.3,regY:95.5,scaleX:0.0528,scaleY:0.0339,skewX:-29.9816,skewY:-13.992,x:222.5,y:188.6},0).to({regX:142.1,regY:98.2,scaleX:0.0515,scaleY:0.1514,skewX:-29.977,skewY:-39.7795,x:232.4,y:205.3},10).wait(12).to({startPosition:0},0).to({regX:139.8,regY:89.1,scaleY:0.0072,skewX:-29.9411,x:242.15,y:222.3},13).to({_off:true},1).wait(1138));

	// smallcaketin
	this.instance_11 = new lib.emptycaketin_gr("synched",0);
	this.instance_11.setTransform(599.9,238.55,0.5108,0.5107,0,0,0,204.2,97.2);
	this.instance_11._off = true;

	this.instance_12 = new lib.fullcaketin_gr("synched",0);
	this.instance_12.setTransform(258.1,238.6,0.5053,0.5049,0,0,0,204,96.9);
	this.instance_12._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(1831).to({_off:false},0).to({x:258.35},14).to({_off:true},49).wait(1142));
	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(1894).to({_off:false},0).wait(40).to({startPosition:0},0).to({x:112.6,y:240.5},15).wait(31).to({startPosition:0},0).to({x:197.6},8).to({regY:97,scaleX:0.3355,scaleY:0.3353,x:245.1,y:234.7},8).to({regX:196,regY:67.9,scaleX:0.2871,scaleY:0.0479,x:242.5,y:246.05},6).to({_off:true},1).wait(1033));

	// bigcaketin
	this.instance_13 = new lib.emptycaketin_gr("synched",0);
	this.instance_13.setTransform(608.25,230.2,0.6591,0.6591,0,0,0,204,97.1);
	this.instance_13._off = true;

	this.instance_14 = new lib.fullcaketin_gr("synched",0);
	this.instance_14.setTransform(251.35,233.75,0.6592,0.6588,0,0,0,204,96.8);
	this.instance_14._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_13).wait(1725).to({_off:false},0).to({x:251.3,y:233.8},15).to({_off:true},50).wait(1246));
	this.timeline.addTween(cjs.Tween.get(this.instance_14).wait(1790).to({_off:false},0).wait(24).to({startPosition:0},0).to({x:466.1,y:233.6},14).wait(119).to({startPosition:0},0).to({x:274.9},12).to({regX:204.3,regY:97.1,scaleX:0.3607,scaleY:0.3604,x:246,y:234.2},12).to({regY:98.5,scaleY:0.0279,y:249.2},9).to({_off:true},1).wait(1055));

	// frontbowl2
	this.instance_15 = new lib.frontbowl_gr("synched",0);
	this.instance_15.setTransform(132.85,236.3,0.8521,0.8507,0,0,0,76.8,38.1);
	this.instance_15._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_15).wait(1636).to({_off:false},0).to({_off:true},79).wait(1321));

	// Whisk
	this.instance_16 = new lib.whisk_gr("synched",0);
	this.instance_16.setTransform(-125.45,217.05,0.8519,0.8519,0,0,0,142,59.6);
	this.instance_16._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_16).wait(966).to({_off:false},0).to({x:84.55,y:216.9},14).wait(645).to({startPosition:0},0).to({regX:141.8,scaleX:0.8518,scaleY:0.8518,rotation:-14.9991,x:115.95,y:161.45},11).to({regX:142,regY:59.5,rotation:-29.9981,x:109.6,y:197.35},10).to({regX:141.9,rotation:-44.9971,x:94.6,y:197.4},8).to({regX:142,regY:59.6,rotation:8.991,x:161.8,y:197.5},12).to({rotation:-43.4691,x:97.35,y:199},10).to({regX:142.1,scaleX:0.8517,scaleY:0.8517,rotation:16.5283,x:159.45,y:199.05},10).to({regX:142,scaleX:0.8518,scaleY:0.8518,rotation:-43.4691,x:97.35,y:199},12).to({regX:142.1,scaleX:0.8517,scaleY:0.8517,rotation:16.5302,x:159.45},10).to({rotation:-41.5122,x:99.95,y:145.9},7).to({regX:142.2,scaleX:0.8516,scaleY:0.8516,rotation:79.4823,x:58.8,y:254.65},8).wait(195).to({rotation:79.4823},0).to({x:-132.7},14).to({_off:true},1).wait(1103));

	// frontbowl1
	this.instance_17 = new lib.frontbowl_gr("synched",0);
	this.instance_17.setTransform(132.5,236.55,0.852,0.8516,0,0,0,76.5,38);
	this.instance_17._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_17).wait(980).to({_off:false},0).to({_off:true},728).wait(1328));

	// flour
	this.instance_18 = new lib.liquidmilk_gr("synched",0);
	this.instance_18.setTransform(242.05,229.5,0.0861,0.0861,14.9942,0,0,139.8,88.9);
	this.instance_18._off = true;

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#F4E7D7").s().p("AgEATQgHgDgDgEQgFgFABgHQAAgGADgEQAGgJAJABIAAgBQAKACADADQADADACAFIABAHQAAAJgJAHQgFADgEAAg");
	this.shape_10.setTransform(591.9909,266.425);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_10},{t:this.instance_18}]},1419).to({state:[]},7).to({state:[{t:this.instance_18}]},39).to({state:[{t:this.instance_18}]},5).to({state:[{t:this.instance_18}]},1).to({state:[{t:this.instance_18}]},3).to({state:[{t:this.instance_18}]},1).to({state:[{t:this.instance_18}]},5).to({state:[]},1).to({state:[{t:this.shape_10},{t:this.instance_18}]},38).to({state:[]},7).to({state:[{t:this.instance_18}]},39).to({state:[{t:this.instance_18}]},5).to({state:[{t:this.instance_18}]},1).to({state:[{t:this.instance_18}]},3).to({state:[{t:this.instance_18}]},1).to({state:[{t:this.instance_18}]},5).to({state:[]},1).to({state:[]},953).wait(502));
	this.timeline.addTween(cjs.Tween.get(this.instance_18).wait(1419).to({_off:false},0).to({_off:true},7).wait(39).to({_off:false,regX:139.7,regY:88.8,scaleX:0.3541,scaleY:0.0237,rotation:0,x:139.6,y:176.6},0).to({regY:88.9,scaleY:0.1113,y:189.6},5).wait(1).to({regY:89},0).to({y:195.1},3).wait(1).to({startPosition:0},0).to({regY:87,scaleY:0.0086,y:209.05},5).to({_off:true},1).wait(38).to({_off:false,regX:139.8,regY:88.9,scaleX:0.0861,scaleY:0.0861,rotation:14.9942,x:242.05,y:229.5},0).to({_off:true},7).wait(39).to({_off:false,regX:139.7,regY:88.8,scaleX:0.3541,scaleY:0.0237,rotation:0,x:139.6,y:176.6},0).to({regY:88.9,scaleY:0.1113,y:189.6},5).wait(1).to({regY:89},0).to({y:195.1},3).wait(1).to({startPosition:0},0).to({regY:87,scaleY:0.0086,y:209.05},5).to({_off:true},1).wait(1455));

	// cup
	this.instance_19 = new lib.measuringcup_gr("synched",0);
	this.instance_19.setTransform(599.55,247.95,0.4146,0.4146,0,0,0,165.8,62.6);
	this.instance_19._off = true;

	this.instance_20 = new lib.fullmeasuringcup_gr("synched",0);
	this.instance_20.setTransform(242.15,248.25,0.4143,0.4073,0,0,0,166.8,62.8);
	this.instance_20._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_19).wait(1385).to({_off:false},0).to({x:241.6},13).to({_off:true},28).wait(60).to({_off:false,regY:62.8,scaleY:0.0748,x:151.5,y:167.7},0).to({regY:63.6,scaleY:0.4162,x:152.5,y:167.95},5).wait(1).to({y:167.7},0).to({regX:166,scaleY:0.4155,x:220.25,y:194.65},5).to({regX:165.8,regY:62.6,scaleY:0.4146,x:241.6,y:247.95},7).to({_off:true},22).wait(60).to({_off:false,regY:62.8,scaleY:0.0748,x:151.5,y:167.7},0).to({regY:63.6,scaleY:0.4162,x:152.5,y:167.95},5).wait(1).to({y:167.7},0).to({regX:166,scaleY:0.4155,x:220.9,y:198.55},5).to({regX:165.8,regY:62.6,scaleY:0.4146,x:241.6,y:247.95},7).wait(1).to({startPosition:0},0).to({x:586.2},14).to({_off:true},1).wait(1416));
	this.timeline.addTween(cjs.Tween.get(this.instance_20).wait(1426).to({_off:false},0).wait(16).to({startPosition:0},0).to({regX:166.9,regY:62.9,x:218.3,y:196.9},6).to({regX:166.8,regY:62.8,x:153.65,y:167.7},7).wait(1).to({startPosition:0},0).to({regY:62.2,scaleY:0.0289,skewX:180,y:167.65},5).wait(1).to({startPosition:0},0).to({regY:60.8,scaleY:0.3987,y:168.15},5).wait(13).to({startPosition:0},0).to({regY:62.2,scaleY:0.0289,y:167.65},5).to({_off:true},1).wait(40).to({_off:false,regY:62.8,scaleY:0.4073,skewX:0,x:242.15,y:248.25},0).wait(16).to({startPosition:0},0).to({regX:166.9,regY:62.9,x:219.55,y:195.45},6).to({regX:166.8,regY:62.8,x:153.65,y:167.7},7).wait(1).to({startPosition:0},0).to({regY:62.2,scaleY:0.0289,skewX:180,y:167.65},5).wait(1).to({startPosition:0},0).to({regY:60.8,scaleY:0.3987,y:168.15},5).wait(13).to({startPosition:0},0).to({regY:62.2,scaleY:0.0289,y:167.65},5).to({_off:true},1).wait(1450));

	// flourbag
	this.instance_21 = new lib.justflour_gr("synched",0);
	this.instance_21.setTransform(589.55,216.15,0.3913,0.3913,0,0,0,99.4,108.2);
	this.instance_21._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_21).wait(1393).to({_off:false},0).to({x:327.05,y:220.5},13).wait(1).to({startPosition:0},0).to({regY:108.3,rotation:-75.0014,x:276.15,y:197.45},12).wait(7).to({startPosition:0},0).wait(2).to({startPosition:0},0).to({regY:108.2,rotation:0,x:327.05,y:220.5},13).wait(66).to({startPosition:0},0).to({regY:108.3,rotation:-75.0014,x:276.15,y:197.45},12).wait(7).to({startPosition:0},0).wait(2).to({startPosition:0},0).to({regY:108.2,rotation:0,x:327.05,y:220.5},13).wait(1).to({startPosition:0},0).wait(63).to({startPosition:0},0).to({x:594.35},14).to({_off:true},1).wait(1416));

	// sugar
	this.instance_22 = new lib.liquidmilk_gr("synched",0);
	this.instance_22.setTransform(242.05,229.5,0.0861,0.0861,14.9942,0,0,139.8,88.9);
	this.instance_22._off = true;

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#F4E7D7").s().p("AgEATQgHgDgDgEQgFgFABgHQAAgGADgEQAGgJAJABIAAgBQAKACADADQADADACAFIABAHQAAAJgJAHQgFADgEAAg");
	this.shape_11.setTransform(591.9909,266.425);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_11},{t:this.instance_22}]},1281).to({state:[]},7).to({state:[{t:this.instance_22}]},39).to({state:[{t:this.instance_22}]},5).to({state:[{t:this.instance_22}]},1).to({state:[{t:this.instance_22}]},3).to({state:[{t:this.instance_22}]},1).to({state:[{t:this.instance_22}]},5).to({state:[]},1).to({state:[]},1191).wait(502));
	this.timeline.addTween(cjs.Tween.get(this.instance_22).wait(1281).to({_off:false},0).to({_off:true},7).wait(39).to({_off:false,regX:139.7,regY:88.8,scaleX:0.3541,scaleY:0.0237,rotation:0,x:139.6,y:176.6},0).to({regY:88.9,scaleY:0.1113,y:189.6},5).wait(1).to({regY:89},0).to({y:195.1},3).wait(1).to({startPosition:0},0).to({regY:87,scaleY:0.0086,y:209.05},5).to({_off:true},1).wait(1693));

	// cup
	this.instance_23 = new lib.measuringcup_gr("synched",0);
	this.instance_23.setTransform(599.55,247.95,0.4146,0.4146,0,0,0,165.8,62.6);
	this.instance_23._off = true;

	this.instance_24 = new lib.fullmeasuringcup_gr("synched",0);
	this.instance_24.setTransform(242.15,248.25,0.4143,0.4073,0,0,0,166.8,62.8);
	this.instance_24._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_23).wait(1247).to({_off:false},0).to({x:241.6},13).to({_off:true},28).wait(60).to({_off:false,regY:62.8,scaleY:0.0748,x:151.5,y:167.7},0).to({regY:63.6,scaleY:0.4162,x:152.5,y:167.95},5).wait(1).to({y:167.7},0).to({regX:166,scaleY:0.4155,x:217.75,y:197.9},5).to({regX:165.8,regY:62.6,scaleY:0.4146,x:241.6,y:247.95},7).wait(1).to({startPosition:0},0).to({x:586.2},14).to({_off:true},1).wait(1654));
	this.timeline.addTween(cjs.Tween.get(this.instance_24).wait(1288).to({_off:false},0).wait(16).to({startPosition:0},0).to({regX:166.9,regY:62.9,x:218.3,y:202.65},6).to({regX:166.8,regY:62.8,x:153.65,y:167.7},7).wait(1).to({startPosition:0},0).to({regY:62.2,scaleY:0.0289,skewX:180,y:167.65},5).wait(1).to({startPosition:0},0).to({regY:60.8,scaleY:0.3987,y:168.15},5).wait(13).to({startPosition:0},0).to({regY:62.2,scaleY:0.0289,y:167.65},5).to({_off:true},1).wait(1688));

	// sugarbag
	this.instance_25 = new lib.justsugar_gr("synched",0);
	this.instance_25.setTransform(601.55,221.55,0.5922,0.5922,0,0,0,162,60.6);
	this.instance_25._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_25).wait(1255).to({_off:false},0).to({x:315.1},13).wait(1).to({startPosition:0},0).to({regX:162.1,rotation:-74.998,x:288.65,y:200.45},12).wait(7).to({startPosition:0},0).wait(2).to({startPosition:0},0).to({regX:162,rotation:0,x:315.1,y:221.55},13).wait(64).to({startPosition:0},0).to({x:592.05},14).to({_off:true},1).wait(1654));

	// carton
	this.instance_26 = new lib.milk_gr("synched",0);
	this.instance_26.setTransform(577.55,213.8,0.2447,0.2447,0,0,0,343.2,241.5);
	this.instance_26._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_26).wait(1165).to({_off:false},0).to({x:252.6,y:214.3},13).wait(1).to({startPosition:0},0).to({regX:342.9,regY:241.7,rotation:-74.9993,x:208.15,y:151.85},8).wait(32).to({startPosition:0},0).to({regX:343.2,regY:241.5,rotation:0,x:252.6,y:214.3},8).wait(1).to({startPosition:0},0).to({x:582.55,y:213.8},11).to({_off:true},1).wait(1796));

	// liquid
	this.instance_27 = new lib.liquidmilk_gr("synched",0);
	this.instance_27.setTransform(164.1,154,0.1295,0.019,14.976,0,0,140,85.1);
	this.instance_27._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_27).wait(1187).to({_off:false},0).to({regX:140.5,regY:86.6,scaleY:0.2067,rotation:14.9698,x:157.55,y:180.85},18).wait(7).to({startPosition:0},0).to({regX:141.2,regY:86,scaleY:0.0122,rotation:14.9544,x:148.05,y:208.85},5).to({_off:true},1).wait(1818));

	// frontcarton
	this.instance_28 = new lib.Tween3("synched",0);
	this.instance_28.setTransform(592.5,252.9);
	this.instance_28._off = true;

	this.instance_29 = new lib.Tween4("synched",0);
	this.instance_29.setTransform(260.65,252.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_28}]},959).to({state:[{t:this.instance_29}]},21).to({state:[]},173).to({state:[]},1381).wait(502));
	this.timeline.addTween(cjs.Tween.get(this.instance_28).wait(959).to({_off:false},0).to({_off:true,x:260.65},21).wait(2056));

	// egg3
	this.instance_30 = new lib.egg_gr("synched",0);
	this.instance_30.setTransform(613.2,237.05,1,1,0,0,0,9.5,12.8);
	this.instance_30._off = true;

	this.instance_31 = new lib.brokenegg1_gr("synched",0);
	this.instance_31.setTransform(187.9,201.15,1,1,-45,0,0,9.6,12.8);
	this.instance_31._off = true;

	this.instance_32 = new lib.brokenegg2_gr("synched",0);
	this.instance_32.setTransform(139.75,162.75,1,1,14.9992,0,0,30,13.4);
	this.instance_32._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_30).wait(959).to({_off:false},0).to({x:281.55},21).wait(117).to({startPosition:0},0).to({regX:9.6,rotation:-45,x:192.95,y:188.45},10).wait(1).to({startPosition:0},0).to({x:187.9,y:201.15},4).wait(1).to({startPosition:0},0).to({x:192.95,y:188.45},4).wait(1).to({startPosition:0},0).to({x:187.9,y:201.15},4).to({_off:true},1).wait(1913));
	this.timeline.addTween(cjs.Tween.get(this.instance_31).wait(1123).to({_off:false},0).to({regX:9.5,regY:13,rotation:-74.9995,x:139.65,y:164.65},6).to({_off:true},1).wait(1906));
	this.timeline.addTween(cjs.Tween.get(this.instance_32).wait(1130).to({_off:false},0).wait(16).to({startPosition:0},0).to({regX:29.9,regY:13.3,scaleX:0.9999,scaleY:0.9999,rotation:173.0532,x:360.4,y:251.3},6).wait(1).to({startPosition:0},0).to({x:569.9},8).to({_off:true},1).wait(1874));

	// eggyolk3
	this.instance_33 = new lib.yolk_gr("synched",0);
	this.instance_33.setTransform(137.1,165.25,0.1313,0.0681,0,0,0,134.4,122.6);
	this.instance_33._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_33).wait(1130).to({_off:false},0).to({regY:121.8,scaleY:0.1313,y:171.2},4).wait(1).to({startPosition:0},0).to({y:197.55},4).wait(1).to({startPosition:0},0).to({regY:121.7,scaleY:0.0115,y:210.45},4).to({_off:true},1).wait(1891));

	// egg2
	this.instance_34 = new lib.egg_gr("synched",0);
	this.instance_34.setTransform(592.5,237.4,1,1,0,0,0,9.5,12.8);
	this.instance_34._off = true;

	this.instance_35 = new lib.brokenegg1_gr("synched",0);
	this.instance_35.setTransform(188.05,201.45,1,1,-45,0,0,9.5,12.9);
	this.instance_35._off = true;

	this.instance_36 = new lib.brokenegg2_gr("synched",0);
	this.instance_36.setTransform(139.75,162.8,1,1,14.9992,0,0,30,13.3);
	this.instance_36._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_34).wait(959).to({_off:false},0).to({x:260.45},21).wait(61).to({startPosition:0},0).to({regY:12.9,rotation:-45.0006,x:192.7,y:188.75},10).wait(1).to({startPosition:0},0).to({x:188,y:201.5},4).wait(1).to({startPosition:0},0).to({x:192.7,y:188.75},4).wait(1).to({startPosition:0},0).to({x:188,y:201.5},4).to({_off:true},1).wait(1969));
	this.timeline.addTween(cjs.Tween.get(this.instance_35).wait(1067).to({_off:false},0).to({regX:9.4,rotation:-74.9987,x:139.85,y:164.55},6).to({_off:true},1).wait(1962));
	this.timeline.addTween(cjs.Tween.get(this.instance_36).wait(1074).to({_off:false},0).wait(16).to({startPosition:0},0).to({regX:29.9,regY:13.2,rotation:180,x:333.25,y:249.45},6).wait(57).to({startPosition:0},0).to({x:574.25},8).to({_off:true},1).wait(1874));

	// eggyolk2
	this.instance_37 = new lib.yolk_gr("synched",0);
	this.instance_37.setTransform(137.1,165.15,0.1342,0.0672,0,0,0,134.8,122.8);
	this.instance_37._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_37).wait(1074).to({_off:false},0).to({regY:121.9,scaleY:0.1341,y:171.45},4).wait(1).to({startPosition:0},0).to({y:197.45},4).wait(1).to({startPosition:0},0).to({regY:122.2,scaleY:0.011,y:210.4},4).to({_off:true},1).wait(1947));

	// egg1
	this.instance_38 = new lib.egg_gr("synched",0);
	this.instance_38.setTransform(571.85,237.05,1,1,0,0,0,9.5,12.8);
	this.instance_38._off = true;

	this.instance_39 = new lib.brokenegg1_gr("synched",0);
	this.instance_39.setTransform(188.1,201.15,1,1,-45,0,0,9.5,12.8);
	this.instance_39._off = true;

	this.instance_40 = new lib.brokenegg2_gr("synched",0);
	this.instance_40.setTransform(139.9,162.7,1,1,14.9992,0,0,30,13.3);
	this.instance_40._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_38).wait(959).to({_off:false},0).to({x:239.45},21).wait(5).to({startPosition:0},0).to({rotation:-45,x:192.75,y:188.8},10).wait(1).to({startPosition:0},0).to({x:187.95,y:201.2},4).wait(1).to({startPosition:0},0).to({x:192.75,y:188.8},4).wait(1).to({startPosition:0},0).to({x:187.95,y:201.2},4).to({_off:true},1).wait(2025));
	this.timeline.addTween(cjs.Tween.get(this.instance_39).wait(1011).to({_off:false},0).to({regY:12.9,rotation:-74.9987,x:139.9,y:164.25},6).to({_off:true},1).wait(2018));
	this.timeline.addTween(cjs.Tween.get(this.instance_40).wait(1018).to({_off:false},0).wait(16).to({startPosition:0},0).to({rotation:67.2543,x:87.55,y:190.15},2).to({rotation:171.7675,x:35.4,y:250.15},4).wait(113).to({startPosition:0},0).to({x:-79.6,y:251},8).to({_off:true},1).wait(1874));

	// eggyolk1
	this.instance_41 = new lib.yolk_gr("synched",0);
	this.instance_41.setTransform(137.35,163.9,0.1316,0.0744,0,0,0,134.4,121.7);
	this.instance_41._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_41).wait(1018).to({_off:false},0).to({regY:121.5,scaleY:0.1316,y:171.25},4).wait(1).to({startPosition:0},0).to({y:198.2},4).wait(1).to({startPosition:0},0).to({regY:120.1,scaleY:0.0087,y:210.75},4).to({_off:true},1).wait(2003));

	// backcarton
	this.instance_42 = new lib.eggcarton_gr("synched",0);
	this.instance_42.setTransform(593.6,233.5,0.4401,0.4401,0,0,0,249.1,109.1);
	this.instance_42._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_42).wait(959).to({_off:false},0).to({x:260.6},21).wait(173).to({startPosition:0},0).to({x:586.55,y:233.6},8).to({_off:true},1).wait(1874));

	// MixingBowl
	this.instance_43 = new lib.bowl_gr("synched",0);
	this.instance_43.setTransform(-71.95,216.9,0.848,0.848,0,0,0,200.2,81.5);
	this.instance_43._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_43).wait(966).to({_off:false},0).to({x:138.35},14).wait(763).to({startPosition:0},0).to({regX:200.5,regY:81.7,scaleX:0.8479,scaleY:0.8479,rotation:40.6344,x:186,y:168.65},15).wait(39).to({startPosition:0},0).to({regX:200.2,regY:81.5,scaleX:0.848,scaleY:0.848,rotation:0,x:138.35,y:216.9},14).wait(36).to({startPosition:0},0).to({regX:200.5,regY:81.7,scaleX:0.8479,scaleY:0.8479,rotation:40.6344,x:186,y:168.65},15).wait(39).to({startPosition:0},0).to({regX:200.2,regY:81.5,scaleX:0.848,scaleY:0.848,rotation:0,x:138.35,y:216.9},14).wait(4).to({startPosition:0},0).to({x:-64.15},14).to({_off:true},1).wait(1102));

	// Replay_btn
	this.instance_44 = new lib.replay_btn();
	this.instance_44.setTransform(286.1,140.9,0.0298,0.0298,0,0,0,224.7,63.7);
	this.instance_44._off = true;
	new cjs.ButtonHelper(this.instance_44, 0, 1, 2, false, new lib.replay_btn(), 3);

	this.replay_btn = new lib.replay_btn();
	this.replay_btn.name = "replay_btn";
	this.replay_btn.setTransform(288.45,143.3,1.1759,1.1759,0,0,0,226.7,65.8);
	new cjs.ButtonHelper(this.replay_btn, 0, 1, 2, false, new lib.replay_btn(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_44}]},2279).to({state:[{t:this.replay_btn}]},20).to({state:[]},734).wait(3));
	this.timeline.addTween(cjs.Tween.get(this.instance_44).wait(2279).to({_off:false},0).to({_off:true,regX:226.7,regY:65.8,scaleX:1.1759,scaleY:1.1759,x:288.45,y:143.3},20).wait(737));

	// Play_btn
	this.play_btn = new lib.play_btn();
	this.play_btn.name = "play_btn";
	this.play_btn.setTransform(279.8,272.5,0.0268,0.0268,0,0,0,229.4,56);
	this.play_btn._off = true;
	new cjs.ButtonHelper(this.play_btn, 0, 1, 2, false, new lib.play_btn(), 3);

	this.timeline.addTween(cjs.Tween.get(this.play_btn).wait(47).to({_off:false},0).to({regX:231.5,regY:58,scaleX:1.0799,scaleY:1.0799,x:282.05,y:274.7},24).to({_off:true},1).wait(2964));

	// Yes_btn
	this.yes_btn = new lib.yes_btn();
	this.yes_btn.name = "yes_btn";
	this.yes_btn.setTransform(154.65,147.2,0.0402,0.0243,0,0,0,226.2,63.8);
	this.yes_btn._off = true;
	new cjs.ButtonHelper(this.yes_btn, 0, 1, 2, false, new lib.yes_btn(), 3);

	this.timeline.addTween(cjs.Tween.get(this.yes_btn).wait(314).to({_off:false},0).to({regX:225.8,regY:61.8,scaleX:0.826,scaleY:0.826,y:145.95},25).to({_off:true},1).wait(2696));

	// Go_btn
	this.instance_45 = new lib.go_btn();
	this.instance_45.setTransform(433.15,338.6,0.0423,0.0423,0,0,0,225.8,63.9);
	this.instance_45._off = true;
	new cjs.ButtonHelper(this.instance_45, 0, 1, 2, false, new lib.go_btn(), 3);

	this.go_btn = new lib.go_btn();
	this.go_btn.name = "go_btn";
	this.go_btn.setTransform(433.1,339.35,0.6542,0.6542,0,0,0,225,65);
	new cjs.ButtonHelper(this.go_btn, 0, 1, 2, false, new lib.go_btn(), 3);

	this.eggsgo_btn = new lib.go_btn();
	this.eggsgo_btn.name = "eggsgo_btn";
	this.eggsgo_btn.setTransform(462.15,337.15,0.0343,0.0343,0,0,0,225.8,64.1);
	this.eggsgo_btn._off = true;
	new cjs.ButtonHelper(this.eggsgo_btn, 0, 1, 2, false, new lib.go_btn(), 3);

	this.milkgo_btn = new lib.go_btn();
	this.milkgo_btn.name = "milkgo_btn";
	this.milkgo_btn.setTransform(451.5,334.05,0.0414,0.0414);
	this.milkgo_btn._off = true;
	new cjs.ButtonHelper(this.milkgo_btn, 0, 1, 2, false, new lib.go_btn(), 3);

	this.sugargo_btn = new lib.go_btn();
	this.sugargo_btn.name = "sugargo_btn";
	this.sugargo_btn.setTransform(460.25,336.6,0.0373,0.0373,0,0,0,225.2,63.1);
	this.sugargo_btn._off = true;
	new cjs.ButtonHelper(this.sugargo_btn, 0, 1, 2, false, new lib.go_btn(), 3);

	this.flourgo_btn = new lib.go_btn();
	this.flourgo_btn.name = "flourgo_btn";
	this.flourgo_btn.setTransform(461.4,337,0.0434,0.0434,0,0,0,225.7,64.5);
	this.flourgo_btn._off = true;
	new cjs.ButtonHelper(this.flourgo_btn, 0, 1, 2, false, new lib.go_btn(), 3);

	this.frostinggo_btn = new lib.go_btn();
	this.frostinggo_btn.name = "frostinggo_btn";
	this.frostinggo_btn.setTransform(450.55,332.85,0.0472,0.0472);
	this.frostinggo_btn._off = true;
	new cjs.ButtonHelper(this.frostinggo_btn, 0, 1, 2, false, new lib.go_btn(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_45}]},481).to({state:[{t:this.go_btn}]},22).to({state:[]},8).to({state:[{t:this.eggsgo_btn}]},287).to({state:[{t:this.eggsgo_btn}]},20).to({state:[]},1).to({state:[{t:this.milkgo_btn}]},9).to({state:[{t:this.milkgo_btn}]},20).to({state:[]},1).to({state:[{t:this.sugargo_btn}]},9).to({state:[{t:this.sugargo_btn}]},20).to({state:[]},1).to({state:[{t:this.flourgo_btn}]},9).to({state:[{t:this.flourgo_btn}]},20).to({state:[]},1).to({state:[{t:this.frostinggo_btn}]},9).to({state:[{t:this.frostinggo_btn}]},20).to({state:[]},1).to({state:[]},1595).wait(502));
	this.timeline.addTween(cjs.Tween.get(this.instance_45).wait(481).to({_off:false},0).to({_off:true,regX:225,regY:65,scaleX:0.6542,scaleY:0.6542,x:433.1,y:339.35},22).wait(2533));
	this.timeline.addTween(cjs.Tween.get(this.eggsgo_btn).wait(798).to({_off:false},0).to({regX:225.7,regY:63.5,scaleX:0.5684,scaleY:0.5684,y:337.1},20).to({_off:true},1).wait(2217));
	this.timeline.addTween(cjs.Tween.get(this.milkgo_btn).wait(828).to({_off:false},0).to({scaleX:0.5614,scaleY:0.5614,x:334.2,y:301.05},20).to({_off:true},1).wait(2187));
	this.timeline.addTween(cjs.Tween.get(this.sugargo_btn).wait(858).to({_off:false},0).to({regX:225.7,regY:63.5,scaleX:0.5617,scaleY:0.5612,x:461.9,y:336.35},20).to({_off:true},1).wait(2157));
	this.timeline.addTween(cjs.Tween.get(this.flourgo_btn).wait(888).to({_off:false},0).to({regY:63.4,scaleX:0.5666,scaleY:0.566,x:460.75,y:337.3},20).to({_off:true},1).wait(2127));
	this.timeline.addTween(cjs.Tween.get(this.frostinggo_btn).wait(918).to({_off:false},0).to({scaleX:0.5618,scaleY:0.5612,x:333.75,y:300.6},20).to({_off:true},1).wait(2097));

	// vfrosting_btn
	this.instance_46 = new lib.vfrosting_btn();
	this.instance_46.setTransform(77.4,102.65,0.0375,0.0375,0,0,0,269.4,117.4);
	this.instance_46._off = true;
	new cjs.ButtonHelper(this.instance_46, 0, 1, 2, false, new lib.vfrosting_btn(), 3);

	this.vfrosting_btn = new lib.vfrosting_btn();
	this.vfrosting_btn.name = "vfrosting_btn";
	this.vfrosting_btn.setTransform(74.65,98.55,0.6763,0.6748,0,0,0,267.8,118.4);
	new cjs.ButtonHelper(this.vfrosting_btn, 0, 1, 2, false, new lib.vfrosting_btn(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_46}]},747).to({state:[{t:this.vfrosting_btn}]},20).to({state:[]},21).to({state:[]},1746).wait(502));
	this.timeline.addTween(cjs.Tween.get(this.instance_46).wait(747).to({_off:false},0).to({_off:true,regX:267.8,regY:118.4,scaleX:0.6763,scaleY:0.6748,x:74.65,y:98.55},20).wait(2269));

	// cfrosting_btn
	this.instance_47 = new lib.cfrosting_btn();
	this.instance_47.setTransform(213.8,97.3,0.0275,0.0275,0,0,0,247.2,129.1);
	this.instance_47._off = true;
	new cjs.ButtonHelper(this.instance_47, 0, 1, 2, false, new lib.cfrosting_btn(), 3);

	this.cfrosting_btn = new lib.cfrosting_btn();
	this.cfrosting_btn.name = "cfrosting_btn";
	this.cfrosting_btn.setTransform(216.85,99,0.7417,0.7381,0,0,0,248.3,130.4);
	new cjs.ButtonHelper(this.cfrosting_btn, 0, 1, 2, false, new lib.cfrosting_btn(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_47}]},757).to({state:[{t:this.cfrosting_btn}]},20).to({state:[]},11).to({state:[]},1746).wait(502));
	this.timeline.addTween(cjs.Tween.get(this.instance_47).wait(757).to({_off:false},0).to({_off:true,regX:248.3,regY:130.4,scaleX:0.7417,scaleY:0.7381,x:216.85,y:99},20).wait(2259));

	// sfrosting_btn
	this.instance_48 = new lib.sfrosting_btn();
	this.instance_48.setTransform(145.3,192.4,0.0396,0.0396,0,0,0,262.9,123.9);
	this.instance_48._off = true;
	new cjs.ButtonHelper(this.instance_48, 0, 1, 2, false, new lib.sfrosting_btn(), 3);

	this.sfrosting_btn = new lib.sfrosting_btn();
	this.sfrosting_btn.name = "sfrosting_btn";
	this.sfrosting_btn.setTransform(148,193.2,0.697,0.6898,0,0,0,262.9,125.7);
	new cjs.ButtonHelper(this.sfrosting_btn, 0, 1, 2, false, new lib.sfrosting_btn(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_48}]},767).to({state:[{t:this.sfrosting_btn}]},20).to({state:[]},1).to({state:[]},1746).wait(502));
	this.timeline.addTween(cjs.Tween.get(this.instance_48).wait(767).to({_off:false},0).to({_off:true,regY:125.7,scaleX:0.697,scaleY:0.6898,x:148,y:193.2},20).wait(2249));

	// flour1_btn
	this.instance_49 = new lib.flour1_btn();
	this.instance_49.setTransform(83.9,99.55,0.0369,0.0369,0,0,0,233.2,122);
	this.instance_49._off = true;
	new cjs.ButtonHelper(this.instance_49, 0, 1, 2, false, new lib.flour1_btn(), 3);

	this.flour1_btn = new lib.flour1_btn();
	this.flour1_btn.name = "flour1_btn";
	this.flour1_btn.setTransform(84.7,95.9,0.6434,0.6409,0,0,0,231.3,122.2);
	new cjs.ButtonHelper(this.flour1_btn, 0, 1, 2, false, new lib.flour1_btn(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_49}]},688).to({state:[{t:this.flour1_btn}]},20).to({state:[]},21).to({state:[]},1805).wait(502));
	this.timeline.addTween(cjs.Tween.get(this.instance_49).wait(688).to({_off:false},0).to({_off:true,regX:231.3,regY:122.2,scaleX:0.6434,scaleY:0.6409,x:84.7,y:95.9},20).wait(2328));

	// flour2_btn
	this.instance_50 = new lib.flour2_btn();
	this.instance_50.setTransform(224.6,101.65,0.0219,0.0219,0,0,0,216.8,123.2);
	this.instance_50._off = true;
	new cjs.ButtonHelper(this.instance_50, 0, 1, 2, false, new lib.flour2_btn(), 3);

	this.flour2_btn = new lib.flour2_btn();
	this.flour2_btn.name = "flour2_btn";
	this.flour2_btn.setTransform(227,98.05,0.6428,0.6388,0,0,0,217.8,123.8);
	new cjs.ButtonHelper(this.flour2_btn, 0, 1, 2, false, new lib.flour2_btn(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_50}]},698).to({state:[{t:this.flour2_btn}]},20).to({state:[]},11).to({state:[]},1805).wait(502));
	this.timeline.addTween(cjs.Tween.get(this.instance_50).wait(698).to({_off:false},0).to({_off:true,regX:217.8,regY:123.8,scaleX:0.6428,scaleY:0.6388,x:227,y:98.05},20).wait(2318));

	// flour3_btn
	this.instance_51 = new lib.flour3_btn();
	this.instance_51.setTransform(152.15,189.55,0.0282,0.0282,0,0,0,193.6,126.1);
	this.instance_51._off = true;
	new cjs.ButtonHelper(this.instance_51, 0, 1, 2, false, new lib.flour3_btn(), 3);

	this.flour3_btn = new lib.flour3_btn();
	this.flour3_btn.name = "flour3_btn";
	this.flour3_btn.setTransform(151.3,187.25,0.6412,0.6387,0,0,0,189.8,120.7);
	new cjs.ButtonHelper(this.flour3_btn, 0, 1, 2, false, new lib.flour3_btn(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_51}]},708).to({state:[{t:this.flour3_btn}]},20).to({state:[]},1).to({state:[]},1805).wait(502));
	this.timeline.addTween(cjs.Tween.get(this.instance_51).wait(708).to({_off:false},0).to({_off:true,regX:189.8,regY:120.7,scaleX:0.6412,scaleY:0.6387,x:151.3,y:187.25},20).wait(2308));

	// sugar1_btn
	this.instance_52 = new lib.sugar1_btn();
	this.instance_52.setTransform(76.3,97.95,0.0306,0.0306,0,0,0,201,135.7);
	this.instance_52._off = true;
	new cjs.ButtonHelper(this.instance_52, 0, 1, 2, false, new lib.sugar1_btn(), 3);

	this.sugar1_btn = new lib.sugar1_btn();
	this.sugar1_btn.name = "sugar1_btn";
	this.sugar1_btn.setTransform(79.6,97.3,0.5529,0.553,0,0,0,200,137.6);
	new cjs.ButtonHelper(this.sugar1_btn, 0, 1, 2, false, new lib.sugar1_btn(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_52}]},629).to({state:[{t:this.sugar1_btn}]},20).to({state:[]},21).to({state:[]},1864).wait(502));
	this.timeline.addTween(cjs.Tween.get(this.instance_52).wait(629).to({_off:false},0).to({_off:true,regX:200,regY:137.6,scaleX:0.5529,scaleY:0.553,x:79.6,y:97.3},20).wait(2387));

	// sugar2_btn
	this.instance_53 = new lib.sugar2_btn();
	this.instance_53.setTransform(213.4,95.5,0.0235,0.0235);
	this.instance_53._off = true;
	new cjs.ButtonHelper(this.instance_53, 0, 1, 2, false, new lib.sugar2_btn(), 3);

	this.sugar2_btn = new lib.sugar2_btn();
	this.sugar2_btn.name = "sugar2_btn";
	this.sugar2_btn.setTransform(103.55,22.7,0.5526,0.5531,0,0,0,-0.2,-0.4);
	new cjs.ButtonHelper(this.sugar2_btn, 0, 1, 2, false, new lib.sugar2_btn(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_53}]},639).to({state:[{t:this.sugar2_btn}]},20).to({state:[]},11).to({state:[]},1864).wait(502));
	this.timeline.addTween(cjs.Tween.get(this.instance_53).wait(639).to({_off:false},0).to({_off:true,regX:-0.2,regY:-0.4,scaleX:0.5526,scaleY:0.5531,x:103.55,y:22.7},20).wait(2377));

	// sugar3_btn
	this.instance_54 = new lib.sugar3_btn();
	this.instance_54.setTransform(143,186.9,0.0165,0.0165,0,0,0,252.1,133.6);
	this.instance_54._off = true;
	new cjs.ButtonHelper(this.instance_54, 0, 1, 2, false, new lib.sugar3_btn(), 3);

	this.sugar3_btn = new lib.sugar3_btn();
	this.sugar3_btn.name = "sugar3_btn";
	this.sugar3_btn.setTransform(151.25,189.5,0.553,0.5529,0,0,0,255.2,135);
	new cjs.ButtonHelper(this.sugar3_btn, 0, 1, 2, false, new lib.sugar3_btn(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_54}]},649).to({state:[{t:this.sugar3_btn}]},20).to({state:[]},1).to({state:[]},1864).wait(502));
	this.timeline.addTween(cjs.Tween.get(this.instance_54).wait(649).to({_off:false},0).to({_off:true,regX:255.2,regY:135,scaleX:0.553,scaleY:0.5529,x:151.25,y:189.5},20).wait(2367));

	// wholemilk_btn
	this.instance_55 = new lib.wholemik_btn();
	this.instance_55.setTransform(71.5,97.15,0.0335,0.0335,0,0,0,174.8,125.5);
	this.instance_55._off = true;
	new cjs.ButtonHelper(this.instance_55, 0, 1, 2, false, new lib.wholemik_btn(), 3);

	this.wholemilk_btn = new lib.wholemik_btn();
	this.wholemilk_btn.name = "wholemilk_btn";
	this.wholemilk_btn.setTransform(71.55,97.75,0.5001,0.5001,0,0,0,175.3,127.1);
	new cjs.ButtonHelper(this.wholemilk_btn, 0, 1, 2, false, new lib.wholemik_btn(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_55}]},570).to({state:[{t:this.wholemilk_btn}]},20).to({state:[]},21).to({state:[]},1923).wait(502));
	this.timeline.addTween(cjs.Tween.get(this.instance_55).wait(570).to({_off:false},0).to({_off:true,regX:175.3,regY:127.1,scaleX:0.5001,scaleY:0.5001,x:71.55,y:97.75},20).wait(2446));

	// onepmilk_btn
	this.instance_56 = new lib._1pmilk_btn();
	this.instance_56.setTransform(215.55,96.55,0.0277,0.0277,0,0,0,159.1,126.5);
	this.instance_56._off = true;
	new cjs.ButtonHelper(this.instance_56, 0, 1, 2, false, new lib._1pmilk_btn(), 3);

	this.onepmilk_btn = new lib._1pmilk_btn();
	this.onepmilk_btn.name = "onepmilk_btn";
	this.onepmilk_btn.setTransform(214.85,95.5,0.4999,0.4999,0,0,0,159.8,126.6);
	new cjs.ButtonHelper(this.onepmilk_btn, 0, 1, 2, false, new lib._1pmilk_btn(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_56}]},580).to({state:[{t:this.onepmilk_btn}]},20).to({state:[]},11).to({state:[]},1923).wait(502));
	this.timeline.addTween(cjs.Tween.get(this.instance_56).wait(580).to({_off:false},0).to({_off:true,regX:159.8,regY:126.6,scaleX:0.4999,scaleY:0.4999,x:214.85,y:95.5},20).wait(2436));

	// skimmilk_btn
	this.instance_57 = new lib.skimmilk_btn();
	this.instance_57.setTransform(143.55,191,0.0277,0.0277,0,0,0,224.1,122.9);
	this.instance_57._off = true;
	new cjs.ButtonHelper(this.instance_57, 0, 1, 2, false, new lib.skimmilk_btn(), 3);

	this.skimmilk_btn = new lib.skimmilk_btn();
	this.skimmilk_btn.name = "skimmilk_btn";
	this.skimmilk_btn.setTransform(141.2,188.25,0.4998,0.4999,0,0,0,225,123.5);
	new cjs.ButtonHelper(this.skimmilk_btn, 0, 1, 2, false, new lib.skimmilk_btn(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_57}]},590).to({state:[{t:this.skimmilk_btn}]},20).to({state:[]},1).to({state:[]},1923).wait(502));
	this.timeline.addTween(cjs.Tween.get(this.instance_57).wait(590).to({_off:false},0).to({_off:true,regX:225,regY:123.5,scaleX:0.4998,scaleY:0.4999,x:141.2,y:188.25},20).wait(2426));

	// eggs1_btn
	this.instance_58 = new lib.eggs1_btn();
	this.instance_58.setTransform(70.45,93.85,0.0242,0.0242,0,0,0,169.8,130.4);
	this.instance_58._off = true;
	new cjs.ButtonHelper(this.instance_58, 0, 1, 2, false, new lib.eggs1_btn(), 3);

	this.eggs1_btn = new lib.eggs1_btn();
	this.eggs1_btn.name = "eggs1_btn";
	this.eggs1_btn.setTransform(70.4,94.55,0.5933,0.5987,0,0,0,170.5,132.3);
	new cjs.ButtonHelper(this.eggs1_btn, 0, 1, 2, false, new lib.eggs1_btn(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_58}]},511).to({state:[{t:this.eggs1_btn}]},20).to({state:[]},21).to({state:[]},1982).wait(502));
	this.timeline.addTween(cjs.Tween.get(this.instance_58).wait(511).to({_off:false},0).to({_off:true,regX:170.5,regY:132.3,scaleX:0.5933,scaleY:0.5987,x:70.4,y:94.55},20).wait(2505));

	// eggs2_btn
	this.instance_59 = new lib.eggs2_btn();
	this.instance_59.setTransform(215,94.3,0.0357,0.0357,0,0,0,183.5,130.3);
	this.instance_59._off = true;
	new cjs.ButtonHelper(this.instance_59, 0, 1, 2, false, new lib.eggs2_btn(), 3);

	this.eggs2_btn = new lib.eggs2_btn();
	this.eggs2_btn.name = "eggs2_btn";
	this.eggs2_btn.setTransform(214,93.1,0.5988,0.5988,0,0,0,181.8,128.7);
	new cjs.ButtonHelper(this.eggs2_btn, 0, 1, 2, false, new lib.eggs2_btn(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_59}]},521).to({state:[{t:this.eggs2_btn}]},20).to({state:[]},11).to({state:[]},1982).wait(502));
	this.timeline.addTween(cjs.Tween.get(this.instance_59).wait(521).to({_off:false},0).to({_off:true,regX:181.8,regY:128.7,scaleX:0.5988,scaleY:0.5988,x:214,y:93.1},20).wait(2495));

	// eggs3_btn
	this.instance_60 = new lib.eggs3_btn();
	this.instance_60.setTransform(141.8,190.35,0.0247,0.0247,0,0,0,184.4,131.7);
	this.instance_60._off = true;
	new cjs.ButtonHelper(this.instance_60, 0, 1, 2, false, new lib.eggs3_btn(), 3);

	this.eggs3_btn = new lib.eggs3_btn();
	this.eggs3_btn.name = "eggs3_btn";
	this.eggs3_btn.setTransform(142.7,191.4,0.5991,0.5988,0,0,0,185.1,132.9);
	new cjs.ButtonHelper(this.eggs3_btn, 0, 1, 2, false, new lib.eggs3_btn(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_60}]},531).to({state:[{t:this.eggs3_btn}]},20).to({state:[]},1).to({state:[]},1982).wait(502));
	this.timeline.addTween(cjs.Tween.get(this.instance_60).wait(531).to({_off:false},0).to({_off:true,regX:185.1,regY:132.9,scaleX:0.5991,scaleY:0.5988,x:142.7,y:191.4},20).wait(2485));

	// surpriseparty
	this.instance_61 = new lib.surpriseparty_gr("synched",0);
	this.instance_61.setTransform(-245.3,122,1,1,0,0,0,349.1,102.5);
	this.instance_61._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_61).wait(23).to({_off:false},0).to({x:276.1,y:123.6},24).to({_off:true},25).wait(2964));

	// ingredientlist
	this.instance_62 = new lib.IngredientList_gr("synched",0);
	this.instance_62.setTransform(154.95,-85.75,0.6489,0.6489,0,0,0,283.3,215.8);
	this.instance_62._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_62).wait(359).to({_off:false},0).to({y:83.4},35).to({_off:true},117).wait(2525));

	// convo
	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#333333").s().p("AgSB3QgIgLAAgRQAAgbASgKQgCgDgNgnQgOgnAAgjQAAgeAMgTQALgTAPAAQAQAAAKATQALATAAAeQAAAhgMAjQgLAlgGALQAIAFAFAKQAFAKAAAMQAAARgIALQgIAMgLAAQgKAAgIgMg");
	this.shape_12.setTransform(432.975,329.975);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#333333").s().p("AhACAIAchhIgwieIBGAAIAPA1IAQg1IBEAAIhKD/g");
	this.shape_13.setTransform(419.775,335.475);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#333333").s().p("AgiB/IAAj9IBFAAIAAD9g");
	this.shape_14.setTransform(406.4,329.975);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#333333").s().p("AgiCAIAAjGQAOALAUAAQAVAAAOgLIAADGgAABhOQgFgJAAgMQAAgLAFgJQAGgIAHAAQAJAAAGAIQAFAIABAMQgBANgFAIQgGAJgJAAQgHAAgGgJg");
	this.shape_15.setTransform(396.75,329.825);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#333333").s().p("AA8BkIAAhcQAAgfgCgJQgCgIgIAAQgHAAgGAHIAACFIhBAAIAAhcQAAgfgCgJQgCgIgJAAQgFAAgIAHIAACFIhFAAIAAjGIBFAAIAAAZQASgaAYAAQAdAAAPAiQAWgiAZAAQAOgBALAIQAKAGAGAOQAFAMACAOQACAOAAAhIAABjg");
	this.shape_16.setTransform(378.1,332.6);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#333333").s().p("AhHB/IAAj9ICPAAIAABAIhDAAIAAAfIAvAAIAAA/IgvAAIAAAfIBDAAIAABAg");
	this.shape_17.setTransform(356.45,329.975);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#333333").s().p("AgdBiQgUgGgSgLIAQg4QAHAOAKAIQAKAJAKAAQANAAAAgPQAAgGgDgEQgCgFgGgCIgQgHQgRgIgIgOQgJgPAAgWQAAgdASgQQASgPAgAAQAgAAAaARIgRAzQgQgWgPAAQgGAAgDADQgDAEAAAFQAAAHAEAFQAFAEANAFQAaAJAIAQQAIARAAATQAAAegRASQgRARgdAAQgOAAgUgFg");
	this.shape_18.setTransform(329.025,332.575);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#333333").s().p("AgiCAIAAjGQAOALAUAAQAVAAAOgLIAADGgAABhOQgFgJAAgMQAAgLAFgJQAFgIAJAAQAHAAAGAIQAHAIAAAMQAAANgHAIQgFAJgIAAQgJAAgFgJg");
	this.shape_19.setTransform(317.3,329.825);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#333333").s().p("AgyBLQgVgdAAgyQAAgcAKgYQAKgYAQgMQAQgLAUAAQAMABAMAGQANAHAKANQALAMAFATQAGATABANIABAbIhHAAQADAQAKAIQAJAJALAAQAYgBAOgVIAAAjQgYAsgqgBQgjAAgVgcgAABgrQgDAIAAANIAAACIAfAAQAAgOgFgJQgEgJgHABQgHAAgFAIg");
	this.shape_20.setTransform(293.125,332.55);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#333333").s().p("AA9BkIAAhcQgBgfgCgJQgCgIgJAAQgGAAgGAHIAACFIhBAAIAAhcQAAgfgCgJQgDgIgIAAQgGAAgGAHIAACFIhGAAIAAjGIBGAAIAAAZQARgaAYAAQAdAAAOAiQAXgiAZAAQAOgBAKAIQALAGAGAOQAFAMACAOQABAOABAhIAABjg");
	this.shape_21.setTransform(271.2,332.6);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#333333").s().p("Ag7BXQgKgPAAgXQAAgbANgPQANgPAWAAQAJAAAMAFQAAgdgZAAQgVAAgUAPIAAg8QAbgXAoAAQAVAAAOAHQAOAHAIAOQAHAPADAPQACAOAAAeIAABiIhGAAIAAgPQgFAHgKAFQgJAEgIAAQgRAAgKgOgAgVAdQgDAFAAAHQAAAJADAGQAFAFAGAAQAHAAADgFIAAgcQgFgDgFAAQgGAAgFAEg");
	this.shape_22.setTransform(249.05,332.675);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.f("#333333").s().p("AAPBkIAAhcQAAgfgCgJQgCgIgJAAQgFAAgHAHIAACFIhGAAIAAjGIBGAAIAAAZQARgaAYAAQAOgBALAIQAKAGAGANQAFAMACAPQACAOAAAhIAABjg");
	this.shape_23.setTransform(231.725,332.6);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.f("#333333").s().p("AhACAIAchhIgwieIBGAAIAPA1IAQg1IBEAAIhKD/g");
	this.shape_24.setTransform(202.575,335.475);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.f("#333333").s().p("AAdB/IAAh/IgdAxIgcgxIAAB/IhMAAIAAj9IBKAAIAeA1IAeg1IBLAAIAAD9g");
	this.shape_25.setTransform(181.65,329.975);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.f("#333333").s().p("AgSB3QgIgLAAgRQAAgbASgKQgCgDgNgnQgOgnAAgjQAAgeAMgTQALgTAPAAQAQAAAKATQALATAAAeQAAAhgMAjQgLAlgGALQAIAFAFAKQAFAKAAAMQAAARgIALQgIAMgLAAQgKAAgIgMg");
	this.shape_26.setTransform(153.425,329.975);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.f("#333333").s().p("AgiCAIAAjGQAOALAUAAQAVAAAOgLIAADGgAABhOQgFgJAAgMQAAgLAFgJQAFgIAJAAQAIAAAFAIQAHAIAAAMQAAANgHAIQgFAJgIAAQgJAAgFgJg");
	this.shape_27.setTransform(143.95,329.825);

	this.shape_28 = new cjs.Shape();
	this.shape_28.graphics.f("#333333").s().p("AAUB/IAAheIgnAAIAABeIhMAAIAAj9IBMAAIAABdIAnAAIAAhdIBMAAIAAD9g");
	this.shape_28.setTransform(127.825,329.975);

	this.shape_29 = new cjs.Shape();
	this.shape_29.graphics.f("#323232").s().p("AgZAmQgLgPAAgXQAAgVALgQQALgQAOAAQAPAAALAPQALARAAAVQAAAXgLAPQgLAQgPAAQgOAAgLgQg");
	this.shape_29.setTransform(526.625,368.75);

	this.shape_30 = new cjs.Shape();
	this.shape_30.graphics.f("#323232").s().p("AhACAIAchhIgwieIBGAAIAPA1IAQg1IBEAAIhKD/g");
	this.shape_30.setTransform(516.125,366.575);

	this.shape_31 = new cjs.Shape();
	this.shape_31.graphics.f("#323232").s().p("AAAB6QgMgGgIgNQgJgNgDgPQgDgOAAgmIAAgmIgcAAIBhhxIAAA5IAeAAIAAA4IgeAAIAAAaQAAAUACAJQACAJAKAAQAJAAAHgPIAABPQgQAQgaAAQgMAAgKgHg");
	this.shape_31.setTransform(500.425,360.975);

	this.shape_32 = new cjs.Shape();
	this.shape_32.graphics.f("#323232").s().p("AhGBlIAAjHIBGAAIAAAqQANgsAZAAQAPAAAJAOQAJAOAAAWQgBAVgIAOQgKANgOAAQgQAAgMgTQgGAIgCALQgCAJAAAnIAAA3g");
	this.shape_32.setTransform(486.75,363.675);

	this.shape_33 = new cjs.Shape();
	this.shape_33.graphics.f("#323232").s().p("Ag7BXQgKgPAAgXQAAgbANgPQANgPAWAAQAKAAALAFQAAgdgZAAQgWAAgSAPIAAg8QAbgXAnAAQAUAAAPAHQAOAHAIAOQAHAPADAPQACAOAAAeIAABiIhGAAIAAgPQgFAHgKAFQgJAEgIAAQgQAAgLgOgAgUAdQgFAFAAAHQAAAJAFAGQAEAFAGAAQAHAAADgFIAAgcQgFgDgFAAQgGAAgEAEg");
	this.shape_33.setTransform(470.2,363.775);

	this.shape_34 = new cjs.Shape();
	this.shape_34.graphics.f("#323232").s().p("AhRCBIAAj/IBGAAIAAAPQAPgQARgBQAaAAARAcQASAcAAAqQAAAugTAdQgSAdgdAAQgOAAgNgJIAABAgAgHgrIgEAEIAAAkQAHAFAEAAQAHgBAEgFQADgHAAgMQAAgKgDgIQgEgGgGgBQgEAAgEAFg");
	this.shape_34.setTransform(453.025,366.5);

	this.shape_35 = new cjs.Shape();
	this.shape_35.graphics.f("#323232").s().p("AgyBKQgVgcAAgyQAAgcAKgYQAKgZAQgKQAQgLAUAAQAMgBAMAHQANAGAKANQALANAFATQAGAUABALIABAcIhHAAQADAPAKAJQAJAIALAAQAYABAOgWIAAAjQgYArgqABQgjgBgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHAAgFAIg");
	this.shape_35.setTransform(424.275,363.65);

	this.shape_36 = new cjs.Shape();
	this.shape_36.graphics.f("#323232").s().p("AgdBiQgUgGgSgLIAQg4QAHAOAKAIQAKAJAKAAQANAAAAgPQAAgGgDgEQgCgFgGgCIgQgHQgRgIgIgOQgJgPAAgWQAAgdASgQQASgPAgAAQAgAAAaARIgRAzQgQgWgPAAQgGAAgDADQgDAEAAAFQAAAHAEAFQAFAEANAFQAaAJAIAQQAIARAAATQAAAegRASQgRARgdAAQgOAAgUgFg");
	this.shape_36.setTransform(408.875,363.675);

	this.shape_37 = new cjs.Shape();
	this.shape_37.graphics.f("#323232").s().p("AgiCAIAAjGQAOALAUAAQAVAAAOgLIAADGgAABhOQgFgJAAgMQAAgLAFgJQAFgIAJAAQAHAAAGAIQAHAIgBAMQABANgHAIQgFAJgIAAQgJAAgFgJg");
	this.shape_37.setTransform(397.15,360.925);

	this.shape_38 = new cjs.Shape();
	this.shape_38.graphics.f("#323232").s().p("AhFBlIAAjHIBFAAIAAAqQANgsAaAAQANAAAKAOQAJAOgBAWQAAAVgJAOQgJANgOAAQgPAAgNgTQgGAIgCALQgCAJAAAnIAAA3g");
	this.shape_38.setTransform(385.2,363.675);

	this.shape_39 = new cjs.Shape();
	this.shape_39.graphics.f("#323232").s().p("AhRCBIAAj/IBGAAIAAAPQAPgQARgBQAaAAARAcQASAcAAAqQAAAugTAdQgSAdgdAAQgOAAgNgJIAABAgAgHgrIgEAEIAAAkQAHAFAEAAQAHgBAEgFQADgHAAgMQAAgKgDgIQgEgGgGgBQgEAAgEAFg");
	this.shape_39.setTransform(367.825,366.5);

	this.shape_40 = new cjs.Shape();
	this.shape_40.graphics.f("#323232").s().p("AhGBlIAAjHIBGAAIAAAqQANgsAZAAQAPAAAJAOQAJAOAAAWQgBAVgIAOQgKANgPAAQgPAAgMgTQgGAIgCALQgCAJAAAnIAAA3g");
	this.shape_40.setTransform(351.3,363.675);

	this.shape_41 = new cjs.Shape();
	this.shape_41.graphics.f("#323232").s().p("Ag4BdQgLgHgFgNQgFgMgBgNQgCgOAAgnIAAhfIBCAAIAABjQAAASACAIQACAJAKAAQAEAAADgEQAEgEAAgCIAAh8IBGAAIAADHIhDAAIAAgjQgKATgLAIQgLAJgPAAQgMABgLgIg");
	this.shape_41.setTransform(333.675,363.85);

	this.shape_42 = new cjs.Shape();
	this.shape_42.graphics.f("#323232").s().p("AgdBiQgUgGgSgLIAQg4QAHAOAKAIQAKAJAKAAQANAAAAgPQAAgGgDgEQgCgFgGgCIgQgHQgRgIgIgOQgJgPAAgWQAAgdASgQQASgPAgAAQAgAAAaARIgRAzQgQgWgPAAQgGAAgDADQgDAEAAAFQAAAHAEAFQAFAEANAFQAaAJAIAQQAIARAAATQAAAegRASQgRARgdAAQgOAAgUgFg");
	this.shape_42.setTransform(317.175,363.675);

	this.shape_43 = new cjs.Shape();
	this.shape_43.graphics.f("#323232").s().p("Ag6BXQgLgPAAgXQAAgbANgPQANgPAWAAQAJAAAMAFQAAgdgZAAQgVAAgUAPIAAg8QAbgXAoAAQAVAAAOAHQAOAHAIAOQAHAPADAPQACAOAAAeIAABiIhGAAIAAgPQgGAHgIAFQgKAEgIAAQgQAAgKgOgAgVAdQgDAFAAAHQAAAJADAGQAEAFAHAAQAHAAADgFIAAgcQgFgDgFAAQgHAAgEAEg");
	this.shape_43.setTransform(290.7,363.775);

	this.shape_44 = new cjs.Shape();
	this.shape_44.graphics.f("#323232").s().p("AhGBlIAAjHIBGAAIAAAqQANgsAZAAQAPAAAJAOQAJAOAAAWQAAAVgJAOQgKANgPAAQgOAAgNgTQgGAIgCALQgCAJAAAnIAAA3g");
	this.shape_44.setTransform(264.2,363.675);

	this.shape_45 = new cjs.Shape();
	this.shape_45.graphics.f("#323232").s().p("AgyBKQgVgcAAgyQAAgcAKgYQAKgZAQgKQAQgLAUAAQAMgBAMAHQANAGAKANQALANAFATQAGAUABALIABAcIhHAAQADAPAKAJQAJAIALAAQAYABAOgWIAAAjQgYArgqABQgjgBgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHAAgFAIg");
	this.shape_45.setTransform(247.875,363.65);

	this.shape_46 = new cjs.Shape();
	this.shape_46.graphics.f("#323232").s().p("AAPB/IAAhfQAAgdgCgIQgDgIgIAAQgGAAgGAIIAACEIhGAAIAAj9IBGAAIAABQQAPgbAcAAQALAAALAHQAMAIAGAOQAGAPABANIABAuIAABhg");
	this.shape_46.setTransform(230.525,361.075);

	this.shape_47 = new cjs.Shape();
	this.shape_47.graphics.f("#323232").s().p("AhMBjIAAhbQAaAkAeAAQAPAAAFgHQAHgGAAgPIAAgDQgLALgSAAQgYAAgPgVQgPgUAAgjQAAgTAGgQQAFgRAJgJQAJgJAMgCQANgDAiAAIBBAAIAACNQAAAlgDAQQgDARgJAOQgIAPgOAHQgPAIgXAAQgtAAghgdgAgRguQAAALAEAGQAEAGAHAAQAFAAAEgFIAAgrIgCAAQgWAAAAAZg");
	this.shape_47.setTransform(200.975,366.575);

	this.shape_48 = new cjs.Shape();
	this.shape_48.graphics.f("#323232").s().p("AAPBlIAAhdQAAgfgCgJQgCgIgJAAQgFAAgHAHIAACGIhGAAIAAjHIBGAAIAAAYQARgaAYAAQAOABALAGQAKAHAGAMQAFANACAOQACAPAAAhIAABkg");
	this.shape_48.setTransform(183.075,363.7);

	this.shape_49 = new cjs.Shape();
	this.shape_49.graphics.f("#323232").s().p("AgiCAIAAjGQAOALAUAAQAVAAAOgLIAADGgAABhOQgFgJAAgMQAAgLAFgJQAGgIAHAAQAIAAAHAIQAFAIABAMQgBANgFAIQgGAJgJAAQgHAAgGgJg");
	this.shape_49.setTransform(168.95,360.925);

	this.shape_50 = new cjs.Shape();
	this.shape_50.graphics.f("#323232").s().p("AAPBkIgPg3IgQA3IgnAAIg6jHIBIAAIAMArIANgrIAfAAIANArIAOgrIBIAAIg8DHg");
	this.shape_50.setTransform(152.65,363.775);

	this.shape_51 = new cjs.Shape();
	this.shape_51.graphics.f("#323232").s().p("Ag1BKQgUgdAAgvQAAgsAVgcQAVgcAgAAQAgAAAVAdQAUAdAAAtQAAAvgUAcQgVAbgiAAQggAAgUgdgAgKgRQgEAGAAAKQAAAJAEAHQAEAGAGAAQAGAAAFgGQAEgGAAgJQAAgKgEgHQgEgGgHAAQgGAAgEAGg");
	this.shape_51.setTransform(134.325,363.675);

	this.shape_52 = new cjs.Shape();
	this.shape_52.graphics.f("#323232").s().p("AhFBlIAAjHIBFAAIAAAqQANgsAaAAQANAAAKAOQAJAOgBAWQAAAVgJAOQgJANgOAAQgPAAgNgTQgGAIgCALQgCAJAAAnIAAA3g");
	this.shape_52.setTransform(119.25,363.675);

	this.shape_53 = new cjs.Shape();
	this.shape_53.graphics.f("#323232").s().p("AAPB/IAAhfQAAgdgCgIQgDgIgIAAQgGAAgGAIIAACEIhGAAIAAj9IBGAAIAABQQAPgbAcAAQALAAALAHQAMAIAGAOQAGAPABANIABAuIAABhg");
	this.shape_53.setTransform(101.725,361.075);

	this.shape_54 = new cjs.Shape();
	this.shape_54.graphics.f("#323232").s().p("AAAB6QgMgGgIgNQgJgNgDgPQgDgOAAgmIAAgmIgcAAIBhhxIAAA5IAeAAIAAA4IgeAAIAAAaQAAAUACAJQACAJAKAAQAJAAAHgPIAABPQgQAQgaAAQgMAAgKgHg");
	this.shape_54.setTransform(85.275,360.975);

	this.shape_55 = new cjs.Shape();
	this.shape_55.graphics.f("#323232").s().p("AA9BlIAAhdQgBgfgCgJQgCgIgJAAQgGAAgGAHIAACGIhBAAIAAhdQAAgfgCgJQgDgIgIAAQgGAAgGAHIAACGIhGAAIAAjHIBGAAIAAAYQARgaAYAAQAdAAAOAjQAXgjAZAAQAOABAKAGQALAHAGANQAFANACAOQABAOABAhIAABkg");
	this.shape_55.setTransform(54.3,363.7);

	this.shape_56 = new cjs.Shape();
	this.shape_56.graphics.f("#323232").s().p("AgOAtIgIgwIAAgpIAtAAIAAApIgHAwg");
	this.shape_56.setTransform(37.15,353.875);

	this.shape_57 = new cjs.Shape();
	this.shape_57.graphics.f("#323232").s().p("AglB/IAAj9IBLAAIAAD9g");
	this.shape_57.setTransform(28.35,361.075);

	this.shape_58 = new cjs.Shape();
	this.shape_58.graphics.f("#323232").s().p("AAbB/QgfAAgLgCQgLgBgLgGQgLgGgLgNQgKgOgGgTQgGgTAAgWQAAgrAUgcQAUgbAeAAQAMAAALAHIAAg8IBGAAIAAD9gAgJALQgFAHAAAKQAAAPAGAGQAFAFANAAIACAAIAAgtQgFgFgHAAQgFAAgEAHg");
	this.shape_58.setTransform(513.825,316.725);

	this.shape_59 = new cjs.Shape();
	this.shape_59.graphics.f("#323232").s().p("AAPBkIAAhcQAAgggCgIQgCgIgJAAQgFAAgHAHIAACFIhGAAIAAjGIBGAAIAAAZQARgaAYAAQAOAAALAGQAKAHAGANQAFAMACAPQACAOAAAhIAABjg");
	this.shape_59.setTransform(495.525,319.35);

	this.shape_60 = new cjs.Shape();
	this.shape_60.graphics.f("#323232").s().p("Ag7BXQgKgPAAgXQAAgbANgPQANgPAWAAQAKAAALAFQAAgdgZAAQgWAAgSAPIAAg8QAbgXAnAAQAUAAAPAHQAOAHAIAOQAIAPACAPQACAOAAAeIAABiIhGAAIAAgPQgGAHgJAFQgJAEgIAAQgQAAgLgOgAgUAdQgFAFAAAHQAAAJAFAGQAEAFAGAAQAHAAADgFIAAgcQgFgDgFAAQgGAAgEAEg");
	this.shape_60.setTransform(477.95,319.425);

	this.shape_61 = new cjs.Shape();
	this.shape_61.graphics.f("#323232").s().p("AhACAIAchhIgwieIBGAAIAPA1IAQg1IBEAAIhKD/g");
	this.shape_61.setTransform(450.025,322.225);

	this.shape_62 = new cjs.Shape();
	this.shape_62.graphics.f("#323232").s().p("Ag7BXQgKgPAAgXQAAgbANgPQANgPAWAAQAKAAALAFQAAgdgZAAQgVAAgUAPIAAg8QAbgXAoAAQAVAAAOAHQAOAHAIAOQAHAPADAPQACAOAAAeIAABiIhGAAIAAgPQgFAHgKAFQgJAEgIAAQgRAAgKgOgAgVAdQgDAFgBAHQABAJADAGQAFAFAGAAQAHAAADgFIAAgcQgFgDgFAAQgGAAgFAEg");
	this.shape_62.setTransform(434.55,319.425);

	this.shape_63 = new cjs.Shape();
	this.shape_63.graphics.f("#323232").s().p("AAbB/QgfAAgLgCQgLgBgLgGQgLgGgLgNQgKgOgGgTQgGgTAAgWQAAgrAUgcQAUgbAeAAQAMAAALAHIAAg8IBGAAIAAD9gAgJALQgFAHAAAKQAAAPAGAGQAFAFANAAIACAAIAAgtQgFgFgHAAQgFAAgEAHg");
	this.shape_63.setTransform(417.025,316.725);

	this.shape_64 = new cjs.Shape();
	this.shape_64.graphics.f("#323232").s().p("AAPB/IAAhfQAAgdgCgIQgDgIgIAAQgGAAgGAIIAACEIhGAAIAAj9IBGAAIAABQQAPgbAcAAQALAAALAHQAMAIAGAOQAGAPABANIABAuIAABhg");
	this.shape_64.setTransform(398.725,316.725);

	this.shape_65 = new cjs.Shape();
	this.shape_65.graphics.f("#323232").s().p("AAAB6QgMgGgIgNQgJgNgDgPQgDgOAAgmIAAgmIgcAAIBhhxIAAA5IAeAAIAAA4IgeAAIAAAaQAAAUACAJQACAJAKAAQAJAAAHgPIAABPQgQAQgaAAQgMAAgKgHg");
	this.shape_65.setTransform(382.275,316.625);

	this.shape_66 = new cjs.Shape();
	this.shape_66.graphics.f("#323232").s().p("AhGBlIAAjHIBGAAIAAAqQANgsAZAAQAPAAAJAOQAJAOAAAWQAAAVgJAOQgKANgPAAQgOAAgNgTQgGAIgCALQgCAJAAAnIAAA3g");
	this.shape_66.setTransform(368.6,319.325);

	this.shape_67 = new cjs.Shape();
	this.shape_67.graphics.f("#323232").s().p("AgiCAIAAjGQAOALAUAAQAVAAAOgLIAADGgAABhOQgFgJAAgMQAAgLAFgJQAGgIAHAAQAIAAAHAIQAFAIAAAMQAAANgFAIQgGAJgJAAQgHAAgGgJg");
	this.shape_67.setTransform(355.5,316.575);

	this.shape_68 = new cjs.Shape();
	this.shape_68.graphics.f("#323232").s().p("AhRB/IAAj9IBGAAIAAA8QANgIAMAAQAeAAATAdQATAcAAArQAAAbgJAXQgJAWgNAMQgOAMgOACQgOADghAAgAgLAIIAAAuIACAAQANAAAFgFQAFgGAAgPQAAgLgDgHQgFgGgGAAQgFAAgGAEg");
	this.shape_68.setTransform(341.575,316.725);

	this.shape_69 = new cjs.Shape();
	this.shape_69.graphics.f("#323232").s().p("AgdBiQgUgGgSgLIAQg4QAHAOAKAIQAKAJAKAAQANAAAAgPQAAgGgDgEQgCgFgGgCIgQgHQgRgIgIgOQgJgPAAgWQAAgdASgQQASgPAgAAQAgAAAaARIgRAzQgQgWgPAAQgGAAgDADQgDAEAAAFQAAAHAEAFQAFAEANAFQAaAJAIAQQAIARAAATQAAAegRASQgRARgdAAQgOAAgUgFg");
	this.shape_69.setTransform(313.575,319.325);

	this.shape_70 = new cjs.Shape();
	this.shape_70.graphics.f("#323232").s().p("AAbB/QgfAAgLgCQgLgBgLgGQgLgGgLgNQgKgOgGgTQgGgTAAgWQAAgrAUgcQAUgbAeAAQAMAAALAHIAAg8IBGAAIAAD9gAgJALQgFAHAAAKQAAAPAGAGQAFAFANAAIACAAIAAgtQgFgFgHAAQgFAAgEAHg");
	this.shape_70.setTransform(297.225,316.725);

	this.shape_71 = new cjs.Shape();
	this.shape_71.graphics.f("#323232").s().p("AAPBkIAAhcQAAgggCgIQgCgIgJAAQgFAAgHAHIAACFIhGAAIAAjGIBGAAIAAAZQARgaAYAAQAOAAALAGQAKAHAGANQAFAMACAPQACAOAAAhIAABjg");
	this.shape_71.setTransform(278.925,319.35);

	this.shape_72 = new cjs.Shape();
	this.shape_72.graphics.f("#323232").s().p("AgyBLQgVgeAAgxQAAgcAKgYQAKgYAQgMQAQgLAUABQAMgBAMAHQANAGAKAOQALAMAFATQAGATABANIABAbIhHAAQADAPAKAJQAJAJALgBQAYAAAOgVIAAAjQgYAsgqAAQgjAAgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgOgFgJQgEgJgHAAQgHABgFAHg");
	this.shape_72.setTransform(261.575,319.3);

	this.shape_73 = new cjs.Shape();
	this.shape_73.graphics.f("#323232").s().p("AgiCAIAAjGQAOALAUAAQAVAAAOgLIAADGgAABhOQgFgJAAgMQAAgLAFgJQAFgIAJAAQAHAAAGAIQAHAIgBAMQABANgHAIQgFAJgIAAQgJAAgFgJg");
	this.shape_73.setTransform(248.65,316.575);

	this.shape_74 = new cjs.Shape();
	this.shape_74.graphics.f("#323232").s().p("AhFBlIAAjHIBFAAIAAAqQANgsAaAAQANAAAKAOQAJAOgBAWQAAAVgJAOQgJANgOAAQgPAAgNgTQgGAIgCALQgCAJAAAnIAAA3g");
	this.shape_74.setTransform(236.7,319.325);

	this.shape_75 = new cjs.Shape();
	this.shape_75.graphics.f("#323232").s().p("AguCAIAAhhIgPAAIAAgpIAPAAIAAgEQAAg0AUgfQAUgeAiAAQAPAAATAHIAABlQgLgSgLAAQgIAAgEAHQgFAHAAALIAAACIAnAAIAAApIgnAAIAABhg");
	this.shape_75.setTransform(221.725,316.575);

	this.shape_76 = new cjs.Shape();
	this.shape_76.graphics.f("#323232").s().p("AAAB6QgMgGgIgNQgJgNgDgPQgDgOAAgmIAAgmIgcAAIBhhxIAAA5IAeAAIAAA4IgeAAIAAAaQAAAUACAJQACAJAKAAQAJAAAHgPIAABPQgQAQgaAAQgMAAgKgHg");
	this.shape_76.setTransform(196.625,316.625);

	this.shape_77 = new cjs.Shape();
	this.shape_77.graphics.f("#323232").s().p("AgdBiQgUgGgSgLIAQg4QAHAOAKAIQAKAJAKAAQANAAAAgPQAAgGgDgEQgCgFgGgCIgQgHQgRgIgIgOQgJgPAAgWQAAgdASgQQASgPAgAAQAgAAAaARIgRAzQgQgWgPAAQgGAAgDADQgDAEAAAFQAAAHAEAFQAFAEANAFQAaAJAIAQQAIARAAATQAAAegRASQgRARgdAAQgOAAgUgFg");
	this.shape_77.setTransform(183.475,319.325);

	this.shape_78 = new cjs.Shape();
	this.shape_78.graphics.f("#323232").s().p("AgyBLQgVgeAAgxQAAgcAKgYQAKgYAQgMQAQgLAUABQAMgBAMAHQANAGAKAOQALAMAFATQAGATABANIABAbIhHAAQADAPAKAJQAJAJALgBQAYAAAOgVIAAAjQgYAsgqAAQgjAAgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgOgFgJQgEgJgHAAQgHABgFAHg");
	this.shape_78.setTransform(168.525,319.3);

	this.shape_79 = new cjs.Shape();
	this.shape_79.graphics.f("#323232").s().p("AhRB/IAAj9IBGAAIAAA8QANgIAMAAQAeAAATAdQATAcAAArQAAAbgJAXQgJAWgNAMQgOAMgOACQgOADghAAgAgLAIIAAAuIACAAQANAAAFgFQAFgGAAgPQAAgLgDgHQgFgGgGAAQgFAAgGAEg");
	this.shape_79.setTransform(151.325,316.725);

	this.shape_80 = new cjs.Shape();
	this.shape_80.graphics.f("#323232").s().p("AhACAIAchhIgwieIBGAAIAPA1IAQg1IBEAAIhKD/g");
	this.shape_80.setTransform(122.075,322.225);

	this.shape_81 = new cjs.Shape();
	this.shape_81.graphics.f("#323232").s().p("AA8BkIAAhcQAAgggCgIQgCgIgIAAQgHAAgGAHIAACFIhBAAIAAhcQAAgfgCgJQgCgIgJAAQgFAAgIAHIAACFIhFAAIAAjGIBFAAIAAAZQASgaAYAAQAdgBAPAjQAWgjAZABQAOAAALAGQAKAHAGAOQAFANACANQACAOAAAhIAABjg");
	this.shape_81.setTransform(100.9,319.35);

	this.shape_82 = new cjs.Shape();
	this.shape_82.graphics.f("#323232").s().p("AgdBiQgUgGgSgLIAQg4QAHAOAKAIQAKAJAKAAQANAAAAgPQAAgGgDgEQgCgFgGgCIgQgHQgRgIgIgOQgJgPAAgWQAAgdASgQQASgPAgAAQAgAAAaARIgRAzQgQgWgPAAQgGAAgDADQgDAEAAAFQAAAHAEAFQAFAEANAFQAaAJAIAQQAIARAAATQAAAegRASQgRARgdAAQgOAAgUgFg");
	this.shape_82.setTransform(68.425,319.325);

	this.shape_83 = new cjs.Shape();
	this.shape_83.graphics.f("#323232").s().p("AgOAtIgIgwIAAgpIAtAAIAAApIgHAwg");
	this.shape_83.setTransform(58.25,309.525);

	this.shape_84 = new cjs.Shape();
	this.shape_84.graphics.f("#323232").s().p("AAAB6QgMgGgIgNQgJgNgDgPQgDgOAAgmIAAgmIgcAAIBhhxIAAA5IAeAAIAAA4IgeAAIAAAaQAAAUACAJQACAJAKAAQAJAAAHgPIAABPQgQAQgaAAQgMAAgKgHg");
	this.shape_84.setTransform(47.875,316.625);

	this.shape_85 = new cjs.Shape();
	this.shape_85.graphics.f("#323232").s().p("AglB/IAAj9IBLAAIAAD9g");
	this.shape_85.setTransform(36.45,316.725);

	this.shape_86 = new cjs.Shape();
	this.shape_86.graphics.f("#323232").s().p("AgPB3QgJgMAAgRQAAgKADgIQACgIAHgMQAKgRADgKQADgKAAgMQAAgUgHgMQgIgNgOAAQgNAAgUAQQAFgmATghQATghAaAAQAUAAAOAVQAOAVAAAeQAAAjgPAbQgPAcgQATQATAKAAAdQAAASgIALQgJAMgMAAQgKAAgIgMg");
	this.shape_86.setTransform(513.625,361.875);

	this.shape_87 = new cjs.Shape();
	this.shape_87.graphics.f("#323232").s().p("AAPBlIAAhdQAAgggCgIQgCgIgJAAQgFAAgHAHIAACGIhGAAIAAjHIBGAAIAAAYQARgaAYAAQAOABALAGQAKAHAGAMQAFANACAOQACAPAAAhIAABkg");
	this.shape_87.setTransform(471.125,364.5);

	this.shape_88 = new cjs.Shape();
	this.shape_88.graphics.f("#323232").s().p("AgyBKQgVgcAAgyQAAgcAKgYQAKgZAQgKQAQgMAUAAQAMAAAMAHQANAGAKANQALANAFATQAGATABAMIABAcIhHAAQADAPAKAJQAJAIALAAQAYABAOgWIAAAjQgYArgqAAQgjAAgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHAAgFAIg");
	this.shape_88.setTransform(453.775,364.45);

	this.shape_89 = new cjs.Shape();
	this.shape_89.graphics.f("#323232").s().p("AgiCAIAAjGQAOALAUAAQAVAAAOgLIAADGgAABhOQgFgJAAgMQAAgLAFgJQAGgIAHAAQAJAAAFAIQAGAIABAMQgBANgGAIQgFAJgJAAQgHAAgGgJg");
	this.shape_89.setTransform(440.85,361.725);

	this.shape_90 = new cjs.Shape();
	this.shape_90.graphics.f("#323232").s().p("AgyBKQgVgcAAgyQAAgcAKgYQAKgZAQgKQAQgMAUAAQAMAAAMAHQANAGAKANQALANAFATQAGATABAMIABAcIhHAAQADAPAKAJQAJAIALAAQAYABAOgWIAAAjQgYArgqAAQgjAAgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHAAgFAIg");
	this.shape_90.setTransform(409.475,364.45);

	this.shape_91 = new cjs.Shape();
	this.shape_91.graphics.f("#323232").s().p("AAPBlIAAhdQAAgggCgIQgCgIgJAAQgFAAgHAHIAACGIhGAAIAAjHIBGAAIAAAYQARgaAYAAQAOABALAGQAKAHAGAMQAFANACAOQACAPAAAhIAABkg");
	this.shape_91.setTransform(359.125,364.5);

	this.shape_92 = new cjs.Shape();
	this.shape_92.graphics.f("#323232").s().p("AgiCAIAAjGQAOALAUAAQAVAAAOgLIAADGgAABhOQgFgJAAgMQAAgLAFgJQAGgIAHAAQAJAAAGAIQAFAIABAMQgBANgFAIQgGAJgJAAQgHAAgGgJg");
	this.shape_92.setTransform(345,361.725);

	this.shape_93 = new cjs.Shape();
	this.shape_93.graphics.f("#323232").s().p("AgyBKQgVgcAAgyQAAgcAKgYQAKgZAQgKQAQgMAUAAQAMAAAMAHQANAGAKANQALANAFATQAGATABAMIABAcIhHAAQADAPAKAJQAJAIALAAQAYABAOgWIAAAjQgYArgqAAQgjAAgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHAAgFAIg");
	this.shape_93.setTransform(320.825,364.45);

	this.shape_94 = new cjs.Shape();
	this.shape_94.graphics.f("#323232").s().p("AgyBKQgVgcAAgyQAAgcAKgYQAKgZAQgKQAQgMAUAAQAMAAAMAHQANAGAKANQALANAFATQAGATABAMIABAcIhHAAQADAPAKAJQAJAIALAAQAYABAOgWIAAAjQgYArgqAAQgjAAgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHAAgFAIg");
	this.shape_94.setTransform(248.825,364.45);

	this.shape_95 = new cjs.Shape();
	this.shape_95.graphics.f("#323232").s().p("AhMBjIAAhbQAaAkAeAAQAPAAAFgHQAHgGAAgPIAAgDQgLALgSAAQgYAAgPgVQgPgUAAgjQAAgTAGgQQAFgRAJgJQAJgJAMgCQANgDAiAAIBBAAIAACNQAAAlgDAQQgDARgJAOQgIAPgOAHQgPAIgXAAQgtAAghgdgAgRguQAAALAEAGQAEAGAHAAQAFAAAEgFIAAgrIgCAAQgWAAAAAZg");
	this.shape_95.setTransform(231.775,367.375);

	this.shape_96 = new cjs.Shape();
	this.shape_96.graphics.f("#323232").s().p("AgyBKQgVgcAAgyQAAgcAKgYQAKgZAQgKQAQgMAUAAQAMAAAMAHQANAGAKANQALANAFATQAGATABAMIABAcIhHAAQADAPAKAJQAJAIALAAQAYABAOgWIAAAjQgYArgqAAQgjAAgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHAAgFAIg");
	this.shape_96.setTransform(203.775,364.45);

	this.shape_97 = new cjs.Shape();
	this.shape_97.graphics.f("#323232").s().p("AA9BlIAAhdQAAgggCgIQgDgIgJAAQgGAAgGAHIAACGIhBAAIAAhdQAAgggCgHQgDgJgIAAQgGAAgGAHIAACGIhHAAIAAjHIBHAAIAAAYQARgaAYAAQAdAAAOAjQAXgjAZAAQAOABAKAGQALAHAFANQAGANACAOQACAOgBAhIAABkg");
	this.shape_97.setTransform(181.85,364.5);

	this.shape_98 = new cjs.Shape();
	this.shape_98.graphics.f("#323232").s().p("AhRCBIAAj/IBGAAIAAAPQAPgRARAAQAaAAARAcQASAcAAAqQAAAugTAdQgSAdgdAAQgOAAgNgIIAAA/gAgHgrIgEAEIAAAkQAHAFAEAAQAHgBAEgFQADgHAAgMQAAgKgDgIQgEgHgGAAQgEAAgEAFg");
	this.shape_98.setTransform(147.575,367.3);

	this.shape_99 = new cjs.Shape();
	this.shape_99.graphics.f("#323232").s().p("AgiB/IAAj9IBFAAIAAD9g");
	this.shape_99.setTransform(133.35,361.875);

	this.shape_100 = new cjs.Shape();
	this.shape_100.graphics.f("#323232").s().p("AgyBKQgVgcAAgyQAAgcAKgYQAKgZAQgKQAQgMAUAAQAMAAAMAHQANAGAKANQALANAFATQAGATABAMIABAcIhHAAQADAPAKAJQAJAIALAAQAYABAOgWIAAAjQgYArgqAAQgjAAgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHAAgFAIg");
	this.shape_100.setTransform(120.475,364.45);

	this.shape_101 = new cjs.Shape();
	this.shape_101.graphics.f("#323232").s().p("Ag4BdQgLgIgFgMQgFgMgBgOQgCgNAAgnIAAheIBCAAIAABiQAAASACAIQACAJAKAAQAEAAADgEQAEgEAAgCIAAh7IBGAAIAADGIhDAAIAAgjQgKATgLAIQgLAJgPAAQgMABgLgIg");
	this.shape_101.setTransform(73.175,364.65);

	this.shape_102 = new cjs.Shape();
	this.shape_102.graphics.f("#323232").s().p("AAPBlIAAhdQAAgfgCgJQgCgIgJAAQgFAAgHAHIAACGIhGAAIAAjHIBGAAIAAAYQARgZAYAAQAOAAALAGQAKAHAGAMQAFANACAOQACAPAAAhIAABkg");
	this.shape_102.setTransform(492.375,320.15);

	this.shape_103 = new cjs.Shape();
	this.shape_103.graphics.f("#323232").s().p("Ag3BeQgbgkAAg5QAAg4AbglQAbgmApAAQASAAATAHQAUAIANAMIggBaQgNgIgSAAQgYAAAAAUQAAAIAGAFQAHAGALAAQASAAANgJIAgBgQgKAJgTAIQgUAJgXAAQgnAAgbglg");
	this.shape_103.setTransform(458.125,317.525);

	this.shape_104 = new cjs.Shape();
	this.shape_104.graphics.f("#323232").s().p("AgZAmQgLgQAAgWQAAgVALgQQALgQAOAAQAPAAALAQQALAQAAAVQAAAWgLAQQgLAQgPAAQgOAAgLgQg");
	this.shape_104.setTransform(434.675,325.2);

	this.shape_105 = new cjs.Shape();
	this.shape_105.graphics.f("#323232").s().p("AgyBKQgVgcAAgyQAAgcAKgYQAKgYAQgLQAQgLAUAAQAMgBAMAHQANAGAKAOQALAMAFATQAGAUABAMIABAbIhHAAQADAPAKAJQAJAJALgBQAYAAAOgVIAAAjQgYAsgqAAQgjAAgVgegAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHABgFAHg");
	this.shape_105.setTransform(421.625,320.1);

	this.shape_106 = new cjs.Shape();
	this.shape_106.graphics.f("#323232").s().p("AANB/IAAgEQAAgqgGgWQgGgWgNgJIAABjIhGAAIAAj9IBGAAIAAB4QAXgOAAgyIAAgCIBIAAIAAACQgBAdgIAVQgJAUgLAKQANANAIAbQAIAaAAAfIAAAUg");
	this.shape_106.setTransform(405,317.525);

	this.shape_107 = new cjs.Shape();
	this.shape_107.graphics.f("#323232").s().p("Ag7BXQgKgPAAgXQAAgbANgPQANgPAWAAQAJAAAMAFQAAgdgZAAQgVAAgUAPIAAg8QAbgXAoAAQAVAAAOAHQAOAHAIAOQAHAPADAPQACAOAAAeIAABiIhGAAIAAgPQgFAHgKAFQgJAEgIAAQgRAAgKgOgAgVAdQgDAFAAAHQAAAJADAGQAEAFAHAAQAHAAADgFIAAgcQgFgDgFAAQgHAAgEAEg");
	this.shape_107.setTransform(387.2,320.225);

	this.shape_108 = new cjs.Shape();
	this.shape_108.graphics.f("#323232").s().p("AgpBMQgWgdgBgxQAAglAVggQATgfArAAQAUAAAaAMIAABXQgWgPgQAAQgKAAgGAFQgGAFAAAIQAAASAYAAQAWAAAOgKIAABXQgUAIgYAAQgnAAgXgbg");
	this.shape_108.setTransform(371.35,320.125);

	this.shape_109 = new cjs.Shape();
	this.shape_109.graphics.f("#323232").s().p("Ag7BXQgKgPAAgXQAAgbANgPQANgPAWAAQAJAAAMAFQAAgdgZAAQgVAAgUAPIAAg8QAbgXAoAAQAVAAAOAHQAOAHAIAOQAHAPADAPQACAOAAAeIAABiIhGAAIAAgPQgFAHgKAFQgJAEgIAAQgRAAgKgOgAgVAdQgDAFAAAHQAAAJADAGQAEAFAHAAQAHAAADgFIAAgcQgFgDgFAAQgHAAgEAEg");
	this.shape_109.setTransform(344.45,320.225);

	this.shape_110 = new cjs.Shape();
	this.shape_110.graphics.f("#323232").s().p("AhGBlIAAjHIBGAAIAAAqQANgsAaAAQAOAAAJAOQAIAOAAAWQABAVgKAOQgJANgPAAQgPAAgMgTQgGAIgCALQgCAJAAAnIAAA3g");
	this.shape_110.setTransform(317.95,320.125);

	this.shape_111 = new cjs.Shape();
	this.shape_111.graphics.f("#323232").s().p("AgyBKQgVgcAAgyQAAgcAKgYQAKgYAQgLQAQgLAUAAQAMgBAMAHQANAGAKAOQALAMAFATQAGAUABAMIABAbIhHAAQADAPAKAJQAJAJALgBQAYAAAOgVIAAAjQgYAsgqAAQgjAAgVgegAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHABgFAHg");
	this.shape_111.setTransform(301.625,320.1);

	this.shape_112 = new cjs.Shape();
	this.shape_112.graphics.f("#323232").s().p("AgyBKQgVgcAAgyQAAgcAKgYQAKgYAQgLQAQgLAUAAQAMgBAMAHQANAGAKAOQALAMAFATQAGAUABAMIABAbIhHAAQADAPAKAJQAJAJALgBQAYAAAOgVIAAAjQgYAsgqAAQgjAAgVgegAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHABgFAHg");
	this.shape_112.setTransform(255.625,320.1);

	this.shape_113 = new cjs.Shape();
	this.shape_113.graphics.f("#323232").s().p("AANB/IAAgEQAAgqgGgWQgGgWgNgJIAABjIhGAAIAAj9IBGAAIAAB4QAXgOAAgyIAAgCIBHAAIAAACQABAdgKAVQgIAUgLAKQANANAIAbQAIAaAAAfIgBAUg");
	this.shape_113.setTransform(239,317.525);

	this.shape_114 = new cjs.Shape();
	this.shape_114.graphics.f("#323232").s().p("Ag6BXQgLgPAAgXQAAgbANgPQANgPAWAAQAKAAALAFQAAgdgZAAQgWAAgSAPIAAg8QAbgXAnAAQAUAAAPAHQAOAHAIAOQAIAPACAPQACAOAAAeIAABiIhGAAIAAgPQgGAHgIAFQgKAEgIAAQgRAAgJgOgAgUAdQgEAFgBAHQABAJAEAGQADAFAHAAQAHAAADgFIAAgcQgFgDgFAAQgHAAgDAEg");
	this.shape_114.setTransform(221.2,320.225);

	this.shape_115 = new cjs.Shape();
	this.shape_115.graphics.f("#323232").s().p("Ag1BKQgUgdAAgvQAAgsAVgcQAVgcAgAAQAgAAAVAdQAUAdAAAtQAAAvgUAcQgVAbgiAAQggAAgUgdgAgKgRQgEAGAAAKQAAAJAEAHQAEAGAGAAQAGAAAFgGQAEgGAAgJQAAgKgEgHQgEgGgHAAQgGAAgEAGg");
	this.shape_115.setTransform(175.025,320.125);

	this.shape_116 = new cjs.Shape();
	this.shape_116.graphics.f("#323232").s().p("AAPBlIAAhdQAAgfgCgJQgCgIgJAAQgFAAgHAHIAACGIhGAAIAAjHIBGAAIAAAYQARgZAYAAQAOAAALAGQAKAHAGAMQAFANACAOQACAPAAAhIAABkg");
	this.shape_116.setTransform(120.175,320.15);

	this.shape_117 = new cjs.Shape();
	this.shape_117.graphics.f("#323232").s().p("AAPBkIgPg3IgQA3IgnAAIg6jHIBHAAIAOArIAMgrIAgAAIAMArIAOgrIBIAAIg8DHg");
	this.shape_117.setTransform(84.55,320.225);

	this.shape_118 = new cjs.Shape();
	this.shape_118.graphics.f("#323232").s().p("AgZAmQgLgQAAgWQAAgVALgQQALgQAOAAQAPAAALAQQALAPAAAWQAAAWgLAQQgLAQgPAAQgOAAgLgQg");
	this.shape_118.setTransform(466.775,338.55);

	this.shape_119 = new cjs.Shape();
	this.shape_119.graphics.f("#323232").s().p("AgiCAIAAjGQAOALAUAAQAVAAAOgLIAADGgAABhOQgFgJAAgMQAAgLAFgJQAFgIAIAAQAJAAAGAIQAFAIAAAMQAAANgFAIQgGAJgJAAQgIAAgFgJg");
	this.shape_119.setTransform(430.1,330.725);

	this.shape_120 = new cjs.Shape();
	this.shape_120.graphics.f("#323232").s().p("AA8BkIAAhcQAAgfgCgJQgCgIgIAAQgHAAgGAHIAACFIhBAAIAAhcQAAgfgCgJQgDgIgIAAQgFAAgIAHIAACFIhFAAIAAjGIBFAAIAAAZQASgaAYAAQAdAAAOAiQAXgiAZAAQAOgBAKAIQALAGAGAOQAFAMACAOQABAOABAhIAABjg");
	this.shape_120.setTransform(374.6,333.5);

	this.shape_121 = new cjs.Shape();
	this.shape_121.graphics.f("#323232").s().p("AgyBLQgVgdAAgyQAAgcAKgYQAKgYAQgMQAQgLAUABQAMAAAMAGQANAHAKANQALAMAFATQAGATABANIABAbIhHAAQADAQAKAIQAJAJALAAQAYgBAOgVIAAAjQgYArgqAAQgjAAgVgcgAABgrQgDAIAAANIAAACIAfAAQAAgOgFgJQgEgJgHABQgHAAgFAIg");
	this.shape_121.setTransform(306.225,333.45);

	this.shape_122 = new cjs.Shape();
	this.shape_122.graphics.f("#323232").s().p("AgyBLQgVgdAAgyQAAgcAKgYQAKgYAQgMQAQgLAUABQAMAAAMAGQANAHAKANQALAMAFATQAGATABANIABAbIhHAAQADAQAKAIQAJAJALAAQAYgBAOgVIAAAjQgYArgqAAQgjAAgVgcgAABgrQgDAIAAANIAAACIAfAAQAAgOgFgJQgEgJgHABQgHAAgFAIg");
	this.shape_122.setTransform(274.675,333.45);

	this.shape_123 = new cjs.Shape();
	this.shape_123.graphics.f("#323232").s().p("AAUB/IAAheIgnAAIAABeIhMAAIAAj9IBMAAIAABdIAnAAIAAhdIBMAAIAAD9g");
	this.shape_123.setTransform(255.275,330.875);

	this.shape_124 = new cjs.Shape();
	this.shape_124.graphics.f("#323232").s().p("AgSB3QgIgLAAgRQAAgbASgKQgCgDgNgnQgOgnAAgjQAAgeAMgTQALgTAPAAQAQAAAKATQALATAAAeQAAAhgMAjQgLAlgGALQAIAFAFAKQAFAKAAAMQAAARgIALQgIAMgLAAQgKAAgIgMg");
	this.shape_124.setTransform(227.975,330.875);

	this.shape_125 = new cjs.Shape();
	this.shape_125.graphics.f("#323232").s().p("AgyBLQgVgdAAgyQAAgcAKgYQAKgYAQgMQAQgLAUABQAMAAAMAGQANAHAKANQALAMAFATQAGATABANIABAbIhHAAQADAQAKAIQAJAJALAAQAYgBAOgVIAAAjQgYArgqAAQgjAAgVgcgAABgrQgDAIAAANIAAACIAfAAQAAgOgFgJQgEgJgHABQgHAAgFAIg");
	this.shape_125.setTransform(215.275,333.45);

	this.shape_126 = new cjs.Shape();
	this.shape_126.graphics.f("#323232").s().p("AA9BkIAAhcQgBgfgCgJQgCgIgJAAQgGAAgGAHIAACFIhBAAIAAhcQAAgfgCgJQgDgIgIAAQgGAAgGAHIAACFIhGAAIAAjGIBGAAIAAAZQARgaAYAAQAdAAAOAiQAXgiAZAAQAOgBAKAIQALAGAGAOQAFAMACAOQABAOABAhIAABjg");
	this.shape_126.setTransform(193.35,333.5);

	this.shape_127 = new cjs.Shape();
	this.shape_127.graphics.f("#323232").s().p("AgyBLQgVgdAAgyQAAgcAKgYQAKgYAQgMQAQgLAUABQAMAAAMAGQANAHAKANQALAMAFATQAGATABANIABAbIhHAAQADAQAKAIQAJAJALAAQAYgBAOgVIAAAjQgYArgqAAQgjAAgVgcgAABgrQgDAIAAANIAAACIAfAAQAAgOgFgJQgEgJgHABQgHAAgFAIg");
	this.shape_127.setTransform(140.625,333.45);

	this.shape_128 = new cjs.Shape();
	this.shape_128.graphics.f("#323232").s().p("AAmB/IgKgrIg2AAIgKArIhNAAIA+j9IBrAAIA6D9gAgNAYIAbAAIgNg9g");
	this.shape_128.setTransform(100.9,330.875);

	this.shape_129 = new cjs.Shape();
	this.shape_129.graphics.f("#323232").s().p("AgiCAIAAjGQAOALAUAAQAVAAAOgLIAADGgAABhOQgFgJAAgMQAAgLAFgJQAFgIAJAAQAIAAAFAIQAHAIAAAMQAAANgHAIQgFAJgIAAQgJAAgFgJg");
	this.shape_129.setTransform(487.3,359.675);

	this.shape_130 = new cjs.Shape();
	this.shape_130.graphics.f("#323232").s().p("Ag4BdQgLgIgFgLQgFgNgBgNQgCgOAAgnIAAhfIBCAAIAABiQAAATACAIQACAJAKAAQAEAAADgEQAEgEAAgDIAAh7IBGAAIAADHIhDAAIAAgjQgKASgLAKQgLAIgPABQgMAAgLgIg");
	this.shape_130.setTransform(404.025,362.6);

	this.shape_131 = new cjs.Shape();
	this.shape_131.graphics.f("#323232").s().p("AAPBlIAAhdQAAgggCgIQgCgIgJAAQgFAAgHAHIAACGIhGAAIAAjHIBGAAIAAAYQARgZAYAAQAOAAALAGQAKAHAGAMQAFANACAOQACAPAAAhIAABkg");
	this.shape_131.setTransform(341.925,362.45);

	this.shape_132 = new cjs.Shape();
	this.shape_132.graphics.f("#323232").s().p("AgyBKQgVgcAAgyQAAgcAKgYQAKgYAQgLQAQgLAUAAQAMgBAMAHQANAGAKAOQALAMAFATQAGAUABAMIABAbIhHAAQADAPAKAJQAJAJALgBQAYAAAOgVIAAAjQgYAsgqAAQgjAAgVgegAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHABgFAHg");
	this.shape_132.setTransform(256.025,362.4);

	this.shape_133 = new cjs.Shape();
	this.shape_133.graphics.f("#323232").s().p("AAPBlIAAhdQAAgggCgIQgCgIgJAAQgFAAgHAHIAACGIhGAAIAAjHIBGAAIAAAYQARgZAYAAQAOAAALAGQAKAHAGAMQAFANACAOQACAPAAAhIAABkg");
	this.shape_133.setTransform(238.675,362.45);

	this.shape_134 = new cjs.Shape();
	this.shape_134.graphics.f("#323232").s().p("AgpBMQgXgdAAgxQABglATggQAVgfApAAQAVAAAZAMIAABXQgVgPgRAAQgJAAgGAFQgGAFAAAIQAAASAYAAQAWAAANgKIAABXQgTAIgYAAQgnAAgXgbg");
	this.shape_134.setTransform(180.7,362.425);

	this.shape_135 = new cjs.Shape();
	this.shape_135.graphics.f("#323232").s().p("AgyBKQgVgcAAgyQAAgcAKgYQAKgYAQgLQAQgLAUAAQAMgBAMAHQANAGAKAOQALAMAFATQAGAUABAMIABAbIhHAAQADAPAKAJQAJAJALgBQAYAAAOgVIAAAjQgYAsgqAAQgjAAgVgegAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHABgFAHg");
	this.shape_135.setTransform(165.325,362.4);

	this.shape_136 = new cjs.Shape();
	this.shape_136.graphics.f("#323232").s().p("AhGBlIAAjHIBGAAIAAAqQANgsAZAAQAOAAAKAOQAIAOABAWQAAAVgKAOQgJANgPAAQgOAAgNgTQgGAIgCALQgCAJAAAnIAAA3g");
	this.shape_136.setTransform(134.7,362.425);

	this.shape_137 = new cjs.Shape();
	this.shape_137.graphics.f("#323232").s().p("Ag1BKQgUgdAAgvQAAgsAVgcQAVgcAgAAQAgAAAVAdQAUAdAAAtQAAAvgUAcQgVAbgiAAQggAAgUgdgAgKgRQgEAGAAAKQAAAJAEAHQAEAGAGAAQAGAAAFgGQAEgGAAgJQAAgKgEgHQgEgGgHAAQgGAAgEAGg");
	this.shape_137.setTransform(118.125,362.425);

	this.shape_138 = new cjs.Shape();
	this.shape_138.graphics.f("#323232").s().p("AgpBMQgWgdgBgxQABglATggQAVgfApAAQAVAAAaAMIAABXQgVgPgSAAQgJAAgGAFQgGAFAAAIQAAASAYAAQAWAAAOgKIAABXQgUAIgYAAQgnAAgXgbg");
	this.shape_138.setTransform(102.05,362.425);

	this.shape_139 = new cjs.Shape();
	this.shape_139.graphics.f("#323232").s().p("AgyBKQgVgcAAgyQAAgcAKgYQAKgYAQgLQAQgLAUAAQAMgBAMAHQANAGAKAOQALAMAFATQAGAUABAMIABAbIhHAAQADAPAKAJQAJAJALgBQAYAAAOgVIAAAjQgYAsgqAAQgjAAgVgegAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHABgFAHg");
	this.shape_139.setTransform(75.375,362.4);

	this.shape_140 = new cjs.Shape();
	this.shape_140.graphics.f("#323232").s().p("AgpBMQgXgdAAgxQABglATggQAVgfApAAQAVAAAZAMIAABXQgVgPgRAAQgJAAgGAFQgGAFAAAIQAAASAYAAQAWAAANgKIAABXQgTAIgZAAQgnAAgWgbg");
	this.shape_140.setTransform(472.65,318.075);

	this.shape_141 = new cjs.Shape();
	this.shape_141.graphics.f("#323232").s().p("AhRCAIAAj+IBGAAIAAAPQAPgQARAAQAagBARAcQASAcAAArQAAAsgTAeQgSAdgdAAQgOAAgNgJIAAA/gAgHgsIgEAGIAAAkQAHADAEAAQAHAAAEgFQADgHAAgMQAAgKgDgIQgEgGgGAAQgEAAgEADg");
	this.shape_141.setTransform(446.575,320.9);

	this.shape_142 = new cjs.Shape();
	this.shape_142.graphics.f("#323232").s().p("AAPBkIAAhcQAAgggCgIQgCgIgJAAQgFAAgHAHIAACFIhGAAIAAjGIBGAAIAAAZQARgaAYAAQAOgBALAIQAKAGAGANQAFAMACAPQACAOAAAhIAABjg");
	this.shape_142.setTransform(398.125,318.1);

	this.shape_143 = new cjs.Shape();
	this.shape_143.graphics.f("#323232").s().p("AA9BkIAAhcQAAgggCgIQgDgIgJAAQgGAAgGAHIAACFIhBAAIAAhcQAAgfgCgJQgDgIgIAAQgGAAgGAHIAACFIhHAAIAAjGIBHAAIAAAZQARgaAZAAQAcAAAOAiQAXgiAZAAQAOgBAKAIQALAGAFAOQAGANACANQACAOgBAhIAABjg");
	this.shape_143.setTransform(333.15,318.1);

	this.shape_144 = new cjs.Shape();
	this.shape_144.graphics.f("#323232").s().p("AgyBLQgVgdAAgyQAAgcAKgYQAKgYAQgMQAQgLAUABQAMAAAMAGQANAHAKANQALAMAFATQAGATABANIABAbIhHAAQADAQAKAIQAJAJALAAQAYgBAOgVIAAAjQgYAsgqAAQgjAAgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHABQgHAAgFAHg");
	this.shape_144.setTransform(311.225,318.05);

	this.shape_145 = new cjs.Shape();
	this.shape_145.graphics.f("#323232").s().p("AgyBLQgVgdAAgyQAAgcAKgYQAKgYAQgMQAQgLAUABQAMAAAMAGQANAHAKANQALAMAFATQAGATABANIABAbIhHAAQADAQAKAIQAJAJALAAQAYgBAOgVIAAAjQgYAsgqAAQgjAAgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHABQgHAAgFAHg");
	this.shape_145.setTransform(261.125,318.05);

	this.shape_146 = new cjs.Shape();
	this.shape_146.graphics.f("#323232").s().p("AgyBLQgVgdAAgyQAAgcAKgYQAKgYAQgMQAQgLAUABQAMAAAMAGQANAHAKANQALAMAFATQAGATABANIABAbIhHAAQADAQAKAIQAJAJALAAQAYgBAOgVIAAAjQgYAsgqAAQgjAAgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHABQgHAAgFAHg");
	this.shape_146.setTransform(186.725,318.05);

	this.shape_147 = new cjs.Shape();
	this.shape_147.graphics.f("#323232").s().p("AA9BkIAAhcQAAgggCgIQgDgIgJAAQgGAAgGAHIAACFIhBAAIAAhcQAAgfgCgJQgDgIgIAAQgGAAgGAHIAACFIhHAAIAAjGIBHAAIAAAZQARgaAYAAQAdAAAOAiQAXgiAZAAQAOgBAKAIQALAGAFAOQAGANACANQACAOgBAhIAABjg");
	this.shape_147.setTransform(146.3,318.1);

	this.shape_148 = new cjs.Shape();
	this.shape_148.graphics.f("#323232").s().p("AgyBLQgVgdAAgyQAAgcAKgYQAKgYAQgMQAQgLAUABQAMAAAMAGQANAHAKANQALAMAFATQAGATABANIABAbIhHAAQADAQAKAIQAJAJALAAQAYgBAOgVIAAAjQgYAsgqAAQgjAAgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHABQgHAAgFAHg");
	this.shape_148.setTransform(124.375,318.05);

	this.shape_149 = new cjs.Shape();
	this.shape_149.graphics.f("#323232").s().p("AA9BkIAAhcQgBgggCgIQgCgIgJAAQgGAAgGAHIAACFIhBAAIAAhcQAAgfgCgJQgDgIgIAAQgGAAgGAHIAACFIhGAAIAAjGIBGAAIAAAZQARgaAYAAQAdAAAOAiQAXgiAZAAQAOgBAKAIQALAGAGAOQAFANACANQABAOABAhIAABjg");
	this.shape_149.setTransform(102.45,318.1);

	this.shape_150 = new cjs.Shape();
	this.shape_150.graphics.f("#323232").s().p("AgyBLQgVgdAAgyQAAgcAKgYQAKgYAQgMQAQgLAUABQAMAAAMAGQANAHAKANQALAMAFATQAGATABANIABAbIhHAAQADAQAKAIQAJAJALAAQAYgBAOgVIAAAjQgYAsgqAAQgjAAgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHABQgHAAgFAHg");
	this.shape_150.setTransform(80.525,318.05);

	this.shape_151 = new cjs.Shape();
	this.shape_151.graphics.f("#323232").s().p("AAPB/IAAgDQAAgsgIgYQgIgXgPAAIgBAAIAABeIhMAAIAAj9IBMAAQAnAAANADQANADAKAJQAKAJAHARQAFAQAAASQAAAmgTASQAcAvAFBLgAgRgZIACAAQALAAAEgGQAFgGAAgNQAAgXgVAAIgBAAg");
	this.shape_151.setTransform(62.825,315.475);

	this.shape_152 = new cjs.Shape();
	this.shape_152.graphics.f("#323232").s().p("AANB/IAAgEQAAgqgGgWQgGgWgNgJIAABjIhGAAIAAj9IBGAAIAAB4QAXgOAAgyIAAgCIBHAAIAAACQAAAdgJAVQgIAUgLAKQANANAIAbQAIAaAAAfIgBAUg");
	this.shape_152.setTransform(238.65,359.275);

	this.shape_153 = new cjs.Shape();
	this.shape_153.graphics.f("#323232").s().p("AgpBMQgXgdABgxQAAglATggQAUgfAqAAQAVAAAZAMIAABXQgUgPgRAAQgKAAgGAFQgGAFAAAIQAAASAYAAQAWAAANgKIAABXQgTAIgZAAQgnAAgWgbg");
	this.shape_153.setTransform(221.35,361.875);

	this.shape_154 = new cjs.Shape();
	this.shape_154.graphics.f("#323232").s().p("Ag4BdQgLgHgFgNQgFgMgBgNQgCgOAAgnIAAhfIBCAAIAABiQAAATACAIQACAJAKAAQAEAAADgEQAEgEAAgCIAAh8IBGAAIAADHIhDAAIAAgjQgKATgLAIQgLAJgPAAQgMABgLgIg");
	this.shape_154.setTransform(204.675,362.05);

	this.shape_155 = new cjs.Shape();
	this.shape_155.graphics.f("#323232").s().p("AggB5QgSgJgOgUQgNgUgGgYQgFgYgBgYQAAg7AbgjQAagjArAAQAUAAAWAJQAXAJARAQIglBMQgWgQgSAAQgMAAgJAJQgIAKAAAPQAAAgAYAAIACAAIAAgnIBMAAIAACIIgBAAIg+ACQgkAAgSgJg");
	this.shape_155.setTransform(113.2,359.225);

	this.shape_156 = new cjs.Shape();
	this.shape_156.graphics.f("#323232").s().p("AgZAmQgLgPAAgXQAAgVALgQQALgQAOAAQAPAAALAQQALAQAAAVQAAAXgLAPQgLAQgPAAQgOAAgLgQg");
	this.shape_156.setTransform(312.125,322.6);

	this.shape_157 = new cjs.Shape();
	this.shape_157.graphics.f("#323232").s().p("AhFBlIAAjHIBFAAIAAAqQANgsAaAAQANAAAKAOQAIAOAAAWQAAAVgJAOQgJANgOAAQgPAAgNgTQgGAIgCALQgCAJAAAnIAAA3g");
	this.shape_157.setTransform(286.65,317.525);

	this.shape_158 = new cjs.Shape();
	this.shape_158.graphics.f("#323232").s().p("Ag7BXQgKgPAAgXQAAgbANgPQANgPAWAAQAJAAAMAFQAAgdgZAAQgVAAgUAPIAAg8QAbgXAoAAQAVAAAOAHQAOAHAIAOQAHAPADAPQACAOAAAeIAABiIhGAAIAAgPQgFAHgJAFQgKAEgIAAQgQAAgLgOgAgVAdQgDAFAAAHQAAAJADAGQAFAFAGAAQAHAAADgFIAAgcQgFgDgFAAQgGAAgFAEg");
	this.shape_158.setTransform(270.1,317.625);

	this.shape_159 = new cjs.Shape();
	this.shape_159.graphics.f("#323232").s().p("Ag1BKQgUgdAAgvQAAgsAVgcQAVgcAgAAQAgAAAVAdQAUAdAAAtQAAAvgUAcQgVAbgiAAQggAAgUgdgAgKgRQgEAGAAAKQAAAJAEAHQAEAGAGAAQAGAAAFgGQAEgGAAgJQAAgKgEgHQgEgGgHAAQgGAAgEAGg");
	this.shape_159.setTransform(167.825,317.525);

	this.shape_160 = new cjs.Shape();
	this.shape_160.graphics.f("#323232").s().p("AggB5QgSgJgNgUQgOgUgFgYQgHgYAAgYQABg7AagjQAbgjAqAAQAUAAAWAJQAXAJARAQIgkBMQgWgQgUAAQgLAAgJAJQgIAKAAAPQAAAgAYAAIACAAIAAgnIBMAAIAACIIgBAAIg/ACQgjAAgSgJg");
	this.shape_160.setTransform(149.9,314.875);

	this.shape_161 = new cjs.Shape();
	this.shape_161.graphics.f("#323232").s().p("AgPAtIgHgwIAAgpIAtAAIAAApIgHAwg");
	this.shape_161.setTransform(136.5,307.725);

	this.shape_162 = new cjs.Shape();
	this.shape_162.graphics.f("#323232").s().p("AgyBLQgVgeAAgxQAAgcAKgYQAKgYAQgMQAQgLAUABQAMAAAMAGQANAGAKAOQALAMAFATQAGATABANIABAbIhHAAQADAPAKAJQAJAJALgBQAYAAAOgVIAAAjQgYAsgqAAQgjAAgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHABgFAHg");
	this.shape_162.setTransform(85.525,317.5);

	this.shape_163 = new cjs.Shape();
	this.shape_163.graphics.f("#323232").s().p("AhVB/IAAj9IBJAAQAoAAASAGQAQAGAMAVQAMAVAAAfQAAAlgQAYQgRAYgZAAQgSAAgTgWIAABpgAgJgQIABAAIAEABQAJAAAFgIQAFgHAAgOQAAgPgFgGQgFgGgNAAIgBAAg");
	this.shape_163.setTransform(53.075,314.925);

	this.shape_164 = new cjs.Shape();
	this.shape_164.graphics.f("#323232").s().p("AgyBKQgVgdAAgxQAAgcAKgYQAKgZAQgKQAQgMAUAAQAMAAAMAHQANAGAKANQALANAFATQAGAUABALIABAcIhHAAQADAPAKAJQAJAIALAAQAYABAOgWIAAAjQgYArgqAAQgjAAgVgdgAABgrQgDAIAAANIAAACIAfAAQAAgOgFgJQgEgIgHgBQgHAAgFAJg");
	this.shape_164.setTransform(441.175,331.05);

	this.shape_165 = new cjs.Shape();
	this.shape_165.graphics.f("#323232").s().p("AgyBKQgVgdAAgxQAAgcAKgYQAKgZAQgKQAQgMAUAAQAMAAAMAHQANAGAKANQALANAFATQAGAUABALIABAcIhHAAQADAPAKAJQAJAIALAAQAYABAOgWIAAAjQgYArgqAAQgjAAgVgdgAABgrQgDAIAAANIAAACIAfAAQAAgOgFgJQgEgIgHgBQgHAAgFAJg");
	this.shape_165.setTransform(424.025,331.05);

	this.shape_166 = new cjs.Shape();
	this.shape_166.graphics.f("#323232").s().p("AAPBlIAAhdQAAgggCgIQgCgIgJAAQgFAAgHAHIAACGIhGAAIAAjHIBGAAIAAAYQARgaAYAAQAOAAALAHQAKAHAGAMQAFANACAOQACAPAAAhIAABkg");
	this.shape_166.setTransform(405.675,331.1);

	this.shape_167 = new cjs.Shape();
	this.shape_167.graphics.f("#323232").s().p("AgyBKQgVgdAAgxQAAgcAKgYQAKgZAQgKQAQgMAUAAQAMAAAMAHQANAGAKANQALANAFATQAGAUABALIABAcIhHAAQADAPAKAJQAJAIALAAQAYABAOgWIAAAjQgYArgqAAQgjAAgVgdgAABgrQgDAIAAANIAAACIAfAAQAAgOgFgJQgEgIgHgBQgHAAgFAJg");
	this.shape_167.setTransform(248.975,331.05);

	this.shape_168 = new cjs.Shape();
	this.shape_168.graphics.f("#323232").s().p("AAPBlIAAhdQAAgggCgIQgCgIgJAAQgFAAgHAHIAACGIhGAAIAAjHIBGAAIAAAYQARgaAYAAQAOAAALAHQAKAHAGAMQAFANACAOQACAPAAAhIAABkg");
	this.shape_168.setTransform(201.425,331.1);

	this.shape_169 = new cjs.Shape();
	this.shape_169.graphics.f("#323232").s().p("Ag6BXQgLgPAAgXQAAgbANgPQANgPAWAAQAKAAALAFQAAgdgZAAQgWAAgSAPIAAg8QAbgXAnAAQAUAAAPAHQAOAHAIAOQAIAPACAPQACAOAAAeIAABiIhGAAIAAgPQgGAHgJAFQgJAEgIAAQgRAAgJgOgAgUAdQgFAFAAAHQAAAJAFAGQAEAFAGAAQAHAAADgFIAAgcQgFgDgFAAQgGAAgEAEg");
	this.shape_169.setTransform(182.85,331.175);

	this.shape_170 = new cjs.Shape();
	this.shape_170.graphics.f("#323232").s().p("AA8BlIAAhdQAAgggCgIQgCgIgJAAQgGAAgGAHIAACGIhBAAIAAhdQAAgggCgHQgDgJgIAAQgFAAgIAHIAACGIhFAAIAAjHIBFAAIAAAYQASgaAYAAQAdAAAOAjQAXgjAZAAQAOAAAKAHQALAHAGANQAFAOACANQABAOABAhIAABkg");
	this.shape_170.setTransform(159.95,331.1);

	this.shape_171 = new cjs.Shape();
	this.shape_171.graphics.f("#323232").s().p("AgvCTIAAhMQAGADAFAAQAKAAACgJQADgJABgfIAAh6QATALAQAAQASAAAPgLIAAB8QABAmgEAUQgDAUgJARQgJAQgNAJQgNAJgRAAQgRAAgLgJgAAOhpQgFgJAAgMQAAgMAFgJQAGgIAIAAQAIAAAHAIQAFAJAAAMQAAAMgFAJQgHAJgIAAQgIAAgGgJg");
	this.shape_171.setTransform(291.55,331.875);

	this.shape_172 = new cjs.Shape();
	this.shape_172.graphics.f("#323232").s().p("AgyBLQgVgeAAgxQAAgcAKgYQAKgYAQgMQAQgLAUABQAMAAAMAGQANAGAKAOQALAMAFATQAGATABANIABAbIhHAAQADAPAKAJQAJAJALgBQAYAAAOgVIAAAjQgYAsgqAAQgjAAgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgOgFgJQgEgJgHAAQgHABgFAHg");
	this.shape_172.setTransform(265.175,331.9);

	this.shape_173 = new cjs.Shape();
	this.shape_173.graphics.f("#323232").s().p("AAbCAIgkhPIAABNIhLAAIAAj9IA2AAIAnBWIAAhWIBNAAIAAD/g");
	this.shape_173.setTransform(219.05,329.4);

	this.shape_174 = new cjs.Shape();
	this.shape_174.graphics.f("#323232").s().p("AgyBKQgVgcAAgyQAAgcAKgYQAKgZAQgKQAQgLAUAAQAMgBAMAHQANAGAKANQALANAFATQAGAUABALIABAcIhHAAQADAPAKAJQAJAIALAAQAYABAOgWIAAAjQgYArgqABQgjgBgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHABgFAHg");
	this.shape_174.setTransform(462.075,331.7);

	this.shape_175 = new cjs.Shape();
	this.shape_175.graphics.f("#323232").s().p("AgyBKQgVgcAAgyQAAgcAKgYQAKgZAQgKQAQgLAUAAQAMgBAMAHQANAGAKANQALANAFATQAGAUABALIABAcIhHAAQADAPAKAJQAJAIALAAQAYABAOgWIAAAjQgYArgqABQgjgBgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHABgFAHg");
	this.shape_175.setTransform(444.925,331.7);

	this.shape_176 = new cjs.Shape();
	this.shape_176.graphics.f("#323232").s().p("AgiCAIAAjGQAOALAUAAQAVAAAOgLIAADGgAABhOQgFgJAAgMQAAgLAFgJQAGgIAHAAQAJAAAGAIQAFAIAAAMQAAANgFAIQgGAJgJAAQgHAAgGgJg");
	this.shape_176.setTransform(295.65,328.975);

	this.shape_177 = new cjs.Shape();
	this.shape_177.graphics.f("#323232").s().p("AA9BlIAAhdQAAgfgCgJQgDgIgJAAQgGAAgGAHIAACGIhBAAIAAhdQAAgfgCgJQgDgIgIAAQgGAAgGAHIAACGIhHAAIAAjHIBHAAIAAAYQARgaAZAAQAcAAAOAjQAXgjAZAAQAOABAKAGQALAHAFANQAGANACAOQACAOgBAhIAABkg");
	this.shape_177.setTransform(276,331.75);

	this.shape_178 = new cjs.Shape();
	this.shape_178.graphics.f("#323232").s().p("AAPBlIAAhdQAAgfgCgJQgCgIgJAAQgFAAgHAHIAACGIhGAAIAAjHIBGAAIAAAYQARgaAYAAQAOABALAGQAKAHAGAMQAFANACAOQACAPAAAhIAABkg");
	this.shape_178.setTransform(175.825,331.75);

	this.shape_179 = new cjs.Shape();
	this.shape_179.graphics.f("#323232").s().p("AgiCAIAAjGQAOALAUAAQAVAAAOgLIAADGgAABhOQgFgJAAgMQAAgLAFgJQAFgIAJAAQAHAAAGAIQAHAIAAAMQAAANgHAIQgFAJgIAAQgJAAgFgJg");
	this.shape_179.setTransform(160.7,328.975);

	this.shape_180 = new cjs.Shape();
	this.shape_180.graphics.f("#323232").s().p("AANB/IAAgEQAAgqgGgWQgGgWgNgJIAABjIhGAAIAAj9IBGAAIAAB4QAXgOAAgyIAAgCIBIAAIAAACQgBAdgIAVQgJAUgLAKQANANAIAbQAIAaAAAfIAAAUg");
	this.shape_180.setTransform(146.35,329.125);

	this.shape_181 = new cjs.Shape();
	this.shape_181.graphics.f("#323232").s().p("Ag6BXQgLgPAAgXQAAgbANgPQANgPAWAAQAJAAAMAFQAAgdgZAAQgWAAgTAPIAAg8QAcgXAnAAQAVAAAOAHQAOAHAIAOQAIAPACAPQACAOAAAeIAABiIhGAAIAAgPQgGAHgIAFQgKAEgIAAQgQAAgKgOgAgVAdQgDAFAAAHQAAAJADAGQAEAFAHAAQAHAAADgFIAAgcQgFgDgFAAQgHAAgEAEg");
	this.shape_181.setTransform(101.6,331.825);

	this.shape_182 = new cjs.Shape();
	this.shape_182.graphics.f("#323232").s().p("AAcB/IgbhlIgZBlIg4AAIg9j9IBLAAIATBTIAWhTIAzAAIAXBTIAThTIBKAAIg6D9g");
	this.shape_182.setTransform(59.225,329.125);

	this.shape_183 = new cjs.Shape();
	this.shape_183.graphics.f("#323232").s().p("AgyBKQgVgcAAgyQAAgcAKgYQAKgZAQgKQAQgLAUAAQAMgBAMAHQANAGAKAOQALAMAFATQAGAUABAMIABAbIhHAAQADAPAKAJQAJAJALgBQAYAAAOgVIAAAjQgYAsgqAAQgjAAgVgegAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHABgFAHg");
	this.shape_183.setTransform(264.725,332.25);

	this.shape_184 = new cjs.Shape();
	this.shape_184.graphics.f("#323232").s().p("Ag7BXQgKgPAAgXQAAgbANgPQANgPAWAAQAKAAALAFQAAgdgZAAQgVAAgUAPIAAg8QAbgXAoAAQAVAAAOAHQAOAHAIAOQAHAPADAPQACAOAAAeIAABiIhGAAIAAgPQgFAHgKAFQgJAEgIAAQgRAAgKgOgAgVAdQgEAFAAAHQAAAJAEAGQAFAFAGAAQAHAAADgFIAAgcQgFgDgFAAQgGAAgFAEg");
	this.shape_184.setTransform(293.25,332.925);

	this.shape_185 = new cjs.Shape();
	this.shape_185.graphics.f("#323232").s().p("Ag4BdQgLgHgFgMQgFgNgBgNQgCgOAAgnIAAhfIBCAAIAABiQAAATACAIQACAJAKAAQAEAAADgEQAEgFAAgCIAAh7IBGAAIAADHIhDAAIAAgjQgKASgLAKQgLAIgPABQgMAAgLgIg");
	this.shape_185.setTransform(256.225,333);

	this.shape_186 = new cjs.Shape();
	this.shape_186.graphics.f("#323232").s().p("AgpBMQgXgdABgxQAAglAUggQATgfArAAQAUAAAZAMIAABXQgUgPgRAAQgKAAgGAFQgGAFAAAIQAAASAYAAQAWAAANgKIAABXQgTAIgZAAQgnAAgWgbg");
	this.shape_186.setTransform(191.2,332.825);

	this.shape_187 = new cjs.Shape();
	this.shape_187.graphics.f("#323232").s().p("Ag4BdQgLgHgFgMQgFgNgBgNQgCgOAAgnIAAhfIBCAAIAABiQAAATACAIQACAJAKAAQAEAAADgEQAEgFAAgCIAAh7IBGAAIAADHIhDAAIAAgjQgKASgLAKQgLAIgPABQgMAAgLgIg");
	this.shape_187.setTransform(173.525,333);

	this.shape_188 = new cjs.Shape();
	this.shape_188.graphics.f("#323232").s().p("AA8BkIAAhcQAAgggCgIQgCgIgIAAQgHAAgGAHIAACFIhBAAIAAhcQAAgfgCgJQgCgIgJAAQgFAAgIAHIAACFIhFAAIAAjGIBFAAIAAAZQASgaAZAAQAcgBAPAjQAWgjAZABQAOAAALAGQAKAHAGAOQAFANACANQACAOAAAhIAABjg");
	this.shape_188.setTransform(149.5,332.85);

	this.shape_189 = new cjs.Shape();
	this.shape_189.graphics.f("#323232").s().p("AgvCTIAAhMQAFADAGAAQAJAAADgJQAEgJAAgfIAAh6QATALAQAAQASAAAQgLIAAB8QAAAmgEAUQgEAUgIARQgIAQgOAJQgNAJgRAAQgQAAgMgJgAAOhpQgFgJgBgMQABgMAFgJQAGgIAIAAQAIAAAHAIQAFAJABAMQgBAMgFAJQgHAJgIAAQgIAAgGgJg");
	this.shape_189.setTransform(291.75,334.575);

	this.shape_190 = new cjs.Shape();
	this.shape_190.graphics.f("#323232").s().p("AgyBLQgVgeAAgxQAAgcAKgYQAKgYAQgLQAQgMAUABQAMAAAMAGQANAGAKAOQALAMAFATQAGATABANIABAbIhHAAQADAPAKAJQAJAJALgBQAYAAAOgVIAAAjQgYAsgqAAQgjAAgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgOgFgJQgEgJgHAAQgHABgFAHg");
	this.shape_190.setTransform(265.375,334.6);

	this.shape_191 = new cjs.Shape();
	this.shape_191.graphics.f("#323232").s().p("AAcCAIgkhPIAABNIhNAAIAAj9IA3AAIAoBWIAAhWIBLAAIAAD/g");
	this.shape_191.setTransform(219.25,332.1);

	this.shape_192 = new cjs.Shape();
	this.shape_192.graphics.f("#323232").s().p("AgyBKQgVgcAAgyQAAgcAKgYQAKgYAQgLQAQgLAUAAQAMgBAMAHQANAGAKAOQALAMAFATQAGAUABAMIABAbIhHAAQADAPAKAJQAJAIALAAQAYAAAOgVIAAAjQgYAsgqAAQgjAAgVgegAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHABgFAHg");
	this.shape_192.setTransform(444.175,334.05);

	this.shape_193 = new cjs.Shape();
	this.shape_193.graphics.f("#323232").s().p("AgyBKQgVgcAAgyQAAgcAKgYQAKgYAQgLQAQgLAUAAQAMgBAMAHQANAGAKAOQALAMAFATQAGAUABAMIABAbIhHAAQADAPAKAJQAJAIALAAQAYAAAOgVIAAAjQgYAsgqAAQgjAAgVgegAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHABgFAHg");
	this.shape_193.setTransform(427.025,334.05);

	this.shape_194 = new cjs.Shape();
	this.shape_194.graphics.f("#323232").s().p("AAPBlIAAhdQAAgggCgIQgCgIgJAAQgFAAgHAHIAACGIhGAAIAAjHIBGAAIAAAYQARgaAYABQAOAAALAGQAKAHAGAMQAFANACAOQACAPAAAhIAABkg");
	this.shape_194.setTransform(408.675,334.1);

	this.shape_195 = new cjs.Shape();
	this.shape_195.graphics.f("#323232").s().p("Ag4BdQgLgIgFgLQgFgNgBgNQgCgOAAgnIAAhfIBCAAIAABiQAAATACAIQACAJAKAAQAEAAADgEQAEgEAAgCIAAh8IBGAAIAADHIhDAAIAAgjQgKASgLAKQgLAIgPABQgMAAgLgIg");
	this.shape_195.setTransform(286.525,334.25);

	this.shape_196 = new cjs.Shape();
	this.shape_196.graphics.f("#323232").s().p("AgpBMQgWgdgBgxQAAglAVggQATgfArAAQAUAAAaAMIAABXQgVgPgSAAQgJAAgGAFQgGAFAAAIQAAASAYAAQAWAAAOgKIAABXQgUAIgYAAQgnAAgXgbg");
	this.shape_196.setTransform(194.85,334.075);

	this.shape_197 = new cjs.Shape();
	this.shape_197.graphics.f("#323232").s().p("Ag4BdQgLgIgFgLQgFgNgBgNQgCgOAAgnIAAhfIBCAAIAABiQAAATACAIQACAJAKAAQAEAAADgEQAEgEAAgCIAAh8IBGAAIAADHIhDAAIAAgjQgKASgLAKQgLAIgPABQgMAAgLgIg");
	this.shape_197.setTransform(177.175,334.25);

	this.shape_198 = new cjs.Shape();
	this.shape_198.graphics.f("#323232").s().p("AA9BlIAAhdQAAgggCgIQgDgIgJAAQgGAAgGAHIAACGIhBAAIAAhdQAAgfgCgJQgDgIgIAAQgGAAgGAHIAACGIhHAAIAAjHIBHAAIAAAYQARgaAZABQAcgBAOAjQAXgjAZABQAOAAAKAGQALAHAFAOQAGANACANQACAOgBAhIAABkg");
	this.shape_198.setTransform(153.15,334.1);

	this.shape_199 = new cjs.Shape();
	this.shape_199.graphics.f("#323232").s().p("AAPBkIgPg3IgQA3IgnAAIg6jHIBHAAIANArIANgrIAfAAIANArIAOgrIBIAAIg8DHg");
	this.shape_199.setTransform(114.5,334.175);

	this.shape_200 = new cjs.Shape();
	this.shape_200.graphics.f("#323232").s().p("AgwCTIAAhMQAHADAFAAQAKAAACgJQADgJAAgfIAAh6QAUALAPAAQATAAAPgLIAAB8QABAmgEAUQgDAUgJARQgJAQgNAJQgNAJgRAAQgRAAgMgJgAAOhpQgGgJABgMQgBgMAGgJQAGgIAIAAQAJAAAGAIQAFAJAAAMQAAAMgFAJQgGAJgJAAQgIAAgGgJg");
	this.shape_200.setTransform(291.45,333.575);

	this.shape_201 = new cjs.Shape();
	this.shape_201.graphics.f("#323232").s().p("AgyBKQgVgcAAgyQAAgcAKgYQAKgZAQgKQAQgMAUAAQAMAAAMAHQANAGAKANQALANAFATQAGAUABALIABAcIhHAAQADAPAKAJQAJAIALAAQAYABAOgWIAAAjQgYArgqAAQgjAAgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHAAgFAIg");
	this.shape_201.setTransform(491.525,332.5);

	this.shape_202 = new cjs.Shape();
	this.shape_202.graphics.f("#323232").s().p("AgyBKQgVgcAAgyQAAgcAKgYQAKgZAQgKQAQgMAUAAQAMAAAMAHQANAGAKANQALANAFATQAGAUABALIABAcIhHAAQADAPAKAJQAJAIALAAQAYABAOgWIAAAjQgYArgqAAQgjAAgVgdgAABgsQgDAJAAANIAAACIAfAAQAAgPgFgIQgEgJgHAAQgHAAgFAIg");
	this.shape_202.setTransform(474.375,332.5);

	this.shape_203 = new cjs.Shape();
	this.shape_203.graphics.f("#323232").s().p("AguCAIAAhhIgPAAIAAgpIAPAAIAAgEQAAg0AUgfQAUgeAiAAQAPAAATAHIAABlQgLgSgLAAQgIAAgEAHQgFAHAAALIAAACIAnAAIAAApIgnAAIAABhg");
	this.shape_203.setTransform(214.625,329.775);

	this.shape_204 = new cjs.Shape();
	this.shape_204.graphics.f("#323232").s().p("AAPBlIAAhdQAAgggCgIQgCgIgJAAQgFAAgHAHIAACGIhGAAIAAjHIBGAAIAAAYQARgaAYAAQAOABALAGQAKAHAGAMQAFANACAOQACAPAAAhIAABkg");
	this.shape_204.setTransform(148.325,332.55);

	this.shape_205 = new cjs.Shape();
	this.shape_205.graphics.f("#323232").s().p("Ag6BXQgLgPAAgXQAAgbANgPQANgPAWAAQAJAAAMAFQAAgdgZAAQgVAAgUAPIAAg8QAbgXAoAAQAVAAAOAHQAOAHAIAOQAHAPADAPQACAOAAAeIAABiIhGAAIAAgPQgFAHgJAFQgKAEgIAAQgQAAgKgOgAgVAdQgDAFAAAHQAAAJADAGQAEAFAHAAQAHAAADgFIAAgcQgFgDgFAAQgHAAgEAEg");
	this.shape_205.setTransform(326.8,362.875);

	this.shape_206 = new cjs.Shape();
	this.shape_206.graphics.f("#323232").s().p("Ag6BXQgLgPAAgXQAAgbANgPQANgPAWAAQAKAAALAFQAAgdgZAAQgWAAgSAPIAAg8QAbgXAnAAQAUAAAPAHQAOAHAIAOQAIAPACAPQACAOAAAeIAABiIhGAAIAAgPQgGAHgJAFQgJAEgIAAQgRAAgJgOgAgUAdQgFAFAAAHQAAAJAFAGQADAFAHAAQAHAAADgFIAAgcQgFgDgFAAQgHAAgDAEg");
	this.shape_206.setTransform(290.85,362.875);

	this.shape_207 = new cjs.Shape();
	this.shape_207.graphics.f("#323232").s().p("AhFBlIAAjHIBFAAIAAAqQANgsAZAAQAOAAAKAOQAJAOAAAWQgBAVgIAOQgKANgOAAQgPAAgNgTQgGAIgCALQgCAJAAAnIAAA3g");
	this.shape_207.setTransform(244.1,362.775);

	this.shape_208 = new cjs.Shape();
	this.shape_208.graphics.f("#323232").s().p("AglB/IAAiWIgmAAIAAhnICYAAIAABnIgnAAIAACWg");
	this.shape_208.setTransform(227.4,360.175);

	this.shape_209 = new cjs.Shape();
	this.shape_209.graphics.f("#323232").s().p("AAMCAIAAg7QgMAHgLAAQgfAAgTgcQgUgbAAgsQAAgcAJgYQAJgXAOgMQAOgMAOgCQAOgDAiAAIA3AAIAAD/gAgIguQgGAFAAAPQAAALAFAHQAEAHAFAAQAHAAAFgGIAAgtIgCAAQgNAAgFAGg");
	this.shape_209.setTransform(37.425,365.675);

	this.shape_210 = new cjs.Shape();
	this.shape_210.graphics.f("#323232").s().p("AAPBlIAAhdQAAgggCgIQgCgIgJAAQgFAAgHAHIAACGIhGAAIAAjHIBGAAIAAAZQARgaAYAAQAOAAALAGQAKAHAGANQAFAMACAPQACAOAAAhIAABkg");
	this.shape_210.setTransform(311.575,318.45);

	this.shape_211 = new cjs.Shape();
	this.shape_211.graphics.f("#323232").s().p("AgZAmQgLgPAAgXQAAgVALgQQALgQAOAAQAPAAALAQQALAQAAAVQAAAXgLAPQgLAQgPAAQgOAAgLgQg");
	this.shape_211.setTransform(176.325,323.5);

	this.shape_212 = new cjs.Shape();
	this.shape_212.graphics.f("#323232").s().p("AgZAmQgLgPAAgXQAAgVALgQQALgQAOAAQAPAAALAQQALAQAAAVQAAAXgLAPQgLAQgPAAQgOAAgLgQg");
	this.shape_212.setTransform(165.925,323.5);

	this.shape_213 = new cjs.Shape();
	this.shape_213.graphics.f("#323232").s().p("AA8BlIAAhdQAAgggCgIQgCgIgJAAQgGAAgGAHIAACGIhBAAIAAhdQAAgfgCgJQgDgIgIAAQgFAAgIAHIAACGIhFAAIAAjHIBFAAIAAAZQASgaAYAAQAdgBAOAjQAXgjAZABQAOAAAKAGQALAHAGAOQAFANACANQABAOABAhIAABkg");
	this.shape_213.setTransform(146.45,318.45);

	this.shape_214 = new cjs.Shape();
	this.shape_214.graphics.f("#323232").s().p("AA9BlIAAhdQgBgggCgIQgCgIgJAAQgGAAgGAHIAACGIhBAAIAAhdQAAgfgCgJQgDgIgIAAQgGAAgGAHIAACGIhGAAIAAjHIBGAAIAAAZQARgaAYAAQAdgBAOAjQAXgjAZABQAOAAAKAGQALAHAGAOQAFANACANQABAOABAhIAABkg");
	this.shape_214.setTransform(117.75,318.45);

	this.shape_215 = new cjs.Shape();
	this.shape_215.graphics.f("#323232").s().p("AA9BlIAAhdQAAgggDgIQgCgIgJAAQgGAAgGAHIAACGIhBAAIAAhdQAAgfgCgJQgCgIgJAAQgGAAgGAHIAACGIhGAAIAAjHIBGAAIAAAZQARgaAYAAQAdgBAOAjQAXgjAZABQAOAAAKAGQALAHAFAOQAGANACANQABAOAAAhIAABkg");
	this.shape_215.setTransform(89.05,318.45);

	this.shape_216 = new cjs.Shape();
	this.shape_216.graphics.f("#323232").s().p("AAPBkIAAhcQAAgfgCgJQgCgIgJAAQgFAAgHAHIAACFIhGAAIAAjGIBGAAIAAAZQARgaAYAAQAOgBALAIQAKAGAGANQAFAMACAPQACAOAAAhIAABjg");
	this.shape_216.setTransform(311.475,317.75);

	this.shape_217 = new cjs.Shape();
	this.shape_217.graphics.f("#323232").s().p("Ag6BXQgLgPAAgXQAAgbANgPQANgPAWAAQAKAAALAFQAAgdgZAAQgWAAgTAPIAAg8QAbgXAoAAQAVAAAOAHQAOAHAIAOQAIAPACAPQACAOAAAeIAABiIhGAAIAAgPQgGAHgIAFQgKAEgIAAQgQAAgKgOgAgVAdQgDAFAAAHQAAAJADAGQAEAFAHAAQAHAAADgFIAAgcQgFgDgFAAQgHAAgEAEg");
	this.shape_217.setTransform(244.25,317.825);

	this.shape_218 = new cjs.Shape();
	this.shape_218.graphics.f("#323232").s().p("AgZAmQgLgQAAgWQAAgVALgQQALgQAOAAQAPAAALAQQALAPAAAWQAAAWgLAQQgLAQgPAAQgOAAgLgQg");
	this.shape_218.setTransform(176.225,322.8);

	this.shape_219 = new cjs.Shape();
	this.shape_219.graphics.f("#323232").s().p("AgZAmQgLgQAAgWQAAgVALgQQALgQAOAAQAPAAALAQQALAPAAAWQAAAWgLAQQgLAQgPAAQgOAAgLgQg");
	this.shape_219.setTransform(165.825,322.8);

	this.shape_220 = new cjs.Shape();
	this.shape_220.graphics.f("#323232").s().p("AA8BkIAAhcQAAgfgCgJQgCgIgIAAQgHAAgGAHIAACFIhBAAIAAhcQAAgfgCgJQgCgIgJAAQgFAAgIAHIAACFIhFAAIAAjGIBFAAIAAAZQASgaAYAAQAdAAAPAiQAWgiAZAAQAOgBALAIQAKAGAGAOQAFAMACAOQACAOAAAhIAABjg");
	this.shape_220.setTransform(146.35,317.75);

	this.shape_221 = new cjs.Shape();
	this.shape_221.graphics.f("#323232").s().p("AA8BkIAAhcQAAgfgCgJQgCgIgIAAQgHAAgGAHIAACFIhBAAIAAhcQAAgfgCgJQgDgIgIAAQgFAAgIAHIAACFIhFAAIAAjGIBFAAIAAAZQASgaAYAAQAdAAAOAiQAXgiAZAAQAOgBALAIQAKAGAGAOQAFAMACAOQABAOABAhIAABjg");
	this.shape_221.setTransform(117.65,317.75);

	this.shape_222 = new cjs.Shape();
	this.shape_222.graphics.f("#323232").s().p("Ag6BXQgLgPAAgXQAAgbANgPQANgPAWAAQAJAAAMAFQAAgdgZAAQgWAAgSAPIAAg8QAagXAoAAQAVAAAOAHQAOAHAIAOQAIAPACAPQACAOAAAeIAABiIhGAAIAAgPQgGAHgIAFQgKAEgIAAQgQAAgKgOgAgUAdQgEAFAAAHQAAAJAEAGQADAFAHAAQAHAAADgFIAAgcQgFgDgFAAQgHAAgDAEg");
	this.shape_222.setTransform(327.5,362.875);

	this.shape_223 = new cjs.Shape();
	this.shape_223.graphics.f("#323232").s().p("AglB/IAAiWIgnAAIAAhnICYAAIAABnIgmAAIAACWg");
	this.shape_223.setTransform(228.1,360.175);

	this.shape_224 = new cjs.Shape();
	this.shape_224.graphics.f("#323232").s().p("AA8BlIAAhdQAAgggCgIQgCgIgIAAQgHAAgGAHIAACGIhBAAIAAhdQAAgfgCgJQgCgIgJAAQgFAAgIAHIAACGIhGAAIAAjHIBGAAIAAAZQASgaAZAAQAcgBAPAjQAWgjAZABQAOAAALAGQAKAHAGAOQAFANACANQACAOAAAhIAABkg");
	this.shape_224.setTransform(147.15,318.45);

	this.shape_225 = new cjs.Shape();
	this.shape_225.graphics.f("#323232").s().p("AA8BlIAAhdQAAgggCgIQgCgIgIAAQgHAAgGAHIAACGIhBAAIAAhdQAAgfgCgJQgCgIgJAAQgFAAgIAHIAACGIhFAAIAAjHIBFAAIAAAZQASgaAZAAQAcgBAPAjQAWgjAZABQAOAAALAGQAKAHAGAOQAFANACANQACAOAAAhIAABkg");
	this.shape_225.setTransform(118.45,318.45);

	this.shape_226 = new cjs.Shape();
	this.shape_226.graphics.f("#323232").s().p("AA8BlIAAhdQAAgggCgIQgCgIgIAAQgHAAgGAHIAACGIhBAAIAAhdQAAgfgCgJQgDgIgIAAQgFAAgIAHIAACGIhFAAIAAjHIBFAAIAAAZQASgaAYAAQAdgBAOAjQAXgjAZABQAOAAALAGQAKAHAGAOQAFANACANQABAOABAhIAABkg");
	this.shape_226.setTransform(89.75,318.45);

	this.shape_227 = new cjs.Shape();
	this.shape_227.graphics.f("#323232").s().p("Ag4BdQgLgHgFgMQgFgNgBgOQgCgNAAgnIAAheIBCAAIAABhQAAATACAJQACAIAKAAQAEAAADgEQAEgFAAgCIAAh6IBGAAIAADGIhDAAIAAgjQgKATgLAJQgLAJgPAAQgMgBgLgHg");
	this.shape_227.setTransform(57.825,362.9);

	this.shape_228 = new cjs.Shape();
	this.shape_228.graphics.f("#323232").s().p("AAPBkIAAhcQAAgggCgIQgCgIgJAAQgFAAgHAHIAACFIhGAAIAAjGIBGAAIAAAYQARgaAYAAQAOAAALAIQAKAGAGAMQAFANACAOQACAPAAAhIAABjg");
	this.shape_228.setTransform(312.275,318.4);

	this.shape_229 = new cjs.Shape();
	this.shape_229.graphics.f("#323232").s().p("AgZAmQgLgPAAgXQAAgWALgPQALgQAOAAQAPAAALAPQALAQAAAWQAAAXgLAPQgLAQgPAAQgOAAgLgQg");
	this.shape_229.setTransform(187.425,323.45);

	this.shape_230 = new cjs.Shape();
	this.shape_230.graphics.f("#323232").s().p("AgZAmQgLgPAAgXQAAgWALgPQALgQAOAAQAPAAALAPQALAQAAAWQAAAXgLAPQgLAQgPAAQgOAAgLgQg");
	this.shape_230.setTransform(177.025,323.45);

	this.shape_231 = new cjs.Shape();
	this.shape_231.graphics.f("#323232").s().p("AgZAmQgLgPAAgXQAAgWALgPQALgQAOAAQAPAAALAPQALAQAAAWQAAAXgLAPQgLAQgPAAQgOAAgLgQg");
	this.shape_231.setTransform(166.625,323.45);

	this.shape_232 = new cjs.Shape();
	this.shape_232.graphics.f("#323232").s().p("AA8BkIAAhcQAAgggCgIQgCgIgIAAQgHAAgGAHIAACFIhBAAIAAhcQAAgggCgHQgCgJgJAAQgFAAgIAHIAACFIhGAAIAAjGIBGAAIAAAYQASgaAZAAQAcABAPAiQAWgiAZgBQAOAAALAIQAKAGAGANQAFAOACANQACAOAAAhIAABjg");
	this.shape_232.setTransform(147.15,318.4);

	this.shape_233 = new cjs.Shape();
	this.shape_233.graphics.f("#323232").s().p("AA8BkIAAhcQAAgggCgIQgCgIgIAAQgHAAgGAHIAACFIhBAAIAAhcQAAgggCgHQgCgJgJAAQgFAAgIAHIAACFIhFAAIAAjGIBFAAIAAAYQASgaAZAAQAcABAPAiQAWgiAZgBQAOAAALAIQAKAGAGANQAFAOACANQACAOAAAhIAABjg");
	this.shape_233.setTransform(118.45,318.4);

	this.shape_234 = new cjs.Shape();
	this.shape_234.graphics.f("#323232").s().p("AA8BkIAAhcQAAgggCgIQgCgIgIAAQgHAAgGAHIAACFIhBAAIAAhcQAAgggCgHQgDgJgIAAQgFAAgIAHIAACFIhFAAIAAjGIBFAAIAAAYQASgaAYAAQAdABAOAiQAXgiAZgBQAOAAALAIQAKAGAGANQAFAOACANQABAOABAhIAABjg");
	this.shape_234.setTransform(89.75,318.4);

	this.shape_235 = new cjs.Shape();
	this.shape_235.graphics.f("#323232").s().p("AgvCTIAAhMQAFADAGAAQAJAAADgJQAEgJAAgfIAAh6QATALAQAAQASAAAPgLIAAB8QAAAmgDAUQgEAUgIARQgIAQgOAJQgNAJgRAAQgQAAgMgJgAAOhpQgFgJgBgMQABgMAFgJQAGgIAIAAQAIAAAHAIQAFAJAAAMQAAAMgFAJQgHAJgIAAQgIAAgGgJg");
	this.shape_235.setTransform(291.2,332.075);

	this.shape_236 = new cjs.Shape();
	this.shape_236.graphics.f("#323232").s().p("AgyBLQgVgdAAgyQAAgcAKgYQAKgYAQgMQAQgLAUAAQAMABAMAGQANAHAKANQALAMAFATQAGATABANIABAbIhHAAQADAQAKAIQAJAJALAAQAYgBAOgVIAAAjQgYArgqAAQgjAAgVgcgAABgrQgDAIAAANIAAACIAfAAQAAgOgFgJQgEgJgHABQgHAAgFAIg");
	this.shape_236.setTransform(264.825,332.1);

	this.shape_237 = new cjs.Shape();
	this.shape_237.graphics.f("#323232").s().p("AAcCAIglhPIAABNIhMAAIAAj8IA3AAIAoBVIAAhVIBMAAIAAD+g");
	this.shape_237.setTransform(218.7,329.6);

	this.shape_238 = new cjs.Shape();
	this.shape_238.graphics.f("#323232").s().p("AANB/IAAgEQAAgqgGgWQgGgWgNgJIAABjIhGAAIAAj9IBGAAIAAB4QAXgOAAgyIAAgCIBIAAIAAACQAAAdgJAVQgJAUgLAKQANANAIAbQAIAaAAAfIAAAUg");
	this.shape_238.setTransform(474.05,363.175);

	this.shape_239 = new cjs.Shape();
	this.shape_239.graphics.f("#323232").s().p("AhGBlIAAjHIBGAAIAAAqQANgsAZAAQAOAAAKAOQAIAOAAAWQABAVgJAOQgKANgPAAQgOAAgNgTQgGAIgCALQgCAJAAAnIAAA3g");
	this.shape_239.setTransform(96,365.775);

	this.shape_240 = new cjs.Shape();
	this.shape_240.graphics.f("#323232").s().p("AAPBkIAAhcQAAgggCgIQgCgIgJAAQgFAAgHAHIAACFIhGAAIAAjGIBGAAIAAAZQARgaAYAAQAOgBALAIQAKAGAGANQAFAMACAPQACAOAAAhIAABjg");
	this.shape_240.setTransform(58.875,365.8);

	this.shape_241 = new cjs.Shape();
	this.shape_241.graphics.f("#323232").s().p("AgyBLQgVgeAAgxQAAgcAKgYQAKgZAQgLQAQgLAUAAQAMABAMAGQANAHAKAMQALANAFATQAGATABAMIABAcIhHAAQADAQAKAIQAJAJALAAQAYgBAOgVIAAAjQgYArgqAAQgjAAgVgcgAABgrQgDAIAAANIAAACIAfAAQAAgOgFgJQgEgIgHAAQgHgBgFAJg");
	this.shape_241.setTransform(484.525,321.4);

	this.shape_242 = new cjs.Shape();
	this.shape_242.graphics.f("#323232").s().p("AgiB/IAAj9IBFAAIAAD9g");
	this.shape_242.setTransform(414.1,318.825);

	this.shape_243 = new cjs.Shape();
	this.shape_243.graphics.f("#323232").s().p("Ag7BXQgKgPAAgXQAAgbANgPQANgPAWAAQAJAAAMAFQAAgdgZAAQgWAAgSAPIAAg8QAbgXAnAAQAUAAAPAHQAOAHAIAOQAHAPADAPQACAOAAAeIAABiIhGAAIAAgPQgFAHgKAFQgJAEgIAAQgQAAgLgOgAgUAdQgFAFAAAHQAAAJAFAGQAEAFAGAAQAHAAADgFIAAgcQgFgDgFAAQgGAAgEAEg");
	this.shape_243.setTransform(400,321.525);

	this.shape_244 = new cjs.Shape();
	this.shape_244.graphics.f("#323232").s().p("AgyBLQgVgeAAgxQAAgcAKgYQAKgZAQgLQAQgLAUAAQAMABAMAGQANAHAKAMQALANAFATQAGATABAMIABAcIhHAAQADAQAKAIQAJAJALAAQAYgBAOgVIAAAjQgYArgqAAQgjAAgVgcgAABgrQgDAIAAANIAAACIAfAAQAAgOgFgJQgEgIgHAAQgHgBgFAJg");
	this.shape_244.setTransform(370.575,321.4);

	this.shape_245 = new cjs.Shape();
	this.shape_245.graphics.f("#323232").s().p("AgXBkIg9jHIBGAAIAPAzIAQgzIBDAAIg6DHg");
	this.shape_245.setTransform(354,321.525);

	this.shape_246 = new cjs.Shape();
	this.shape_246.graphics.f("#323232").s().p("AgyBLQgVgeAAgxQAAgcAKgYQAKgZAQgLQAQgLAUAAQAMABAMAGQANAHAKAMQALANAFATQAGATABAMIABAcIhHAAQADAQAKAIQAJAJALAAQAYgBAOgVIAAAjQgYArgqAAQgjAAgVgcgAABgrQgDAIAAANIAAACIAfAAQAAgOgFgJQgEgIgHAAQgHgBgFAJg");
	this.shape_246.setTransform(288.075,321.4);

	this.shape_247 = new cjs.Shape();
	this.shape_247.graphics.f("#323232").s().p("AgyBLQgVgeAAgxQAAgcAKgYQAKgZAQgLQAQgLAUAAQAMABAMAGQANAHAKAMQALANAFATQAGATABAMIABAcIhHAAQADAQAKAIQAJAJALAAQAYgBAOgVIAAAjQgYArgqAAQgjAAgVgcgAABgrQgDAIAAANIAAACIAfAAQAAgOgFgJQgEgIgHAAQgHgBgFAJg");
	this.shape_247.setTransform(235.725,321.4);

	this.shape_248 = new cjs.Shape();
	this.shape_248.graphics.f("#323232").s().p("AgiB/IAAj9IBFAAIAAD9g");
	this.shape_248.setTransform(192.1,318.825);

	this.shape_249 = new cjs.Shape();
	this.shape_249.graphics.f("#323232").s().p("AANB/IAAgEQAAgqgGgWQgGgWgNgJIAABjIhGAAIAAj9IBGAAIAAB4QAXgOAAgyIAAgCIBHAAIAAACQABAdgKAVQgIAUgLAKQANANAIAbQAIAaAAAfIgBAUg");
	this.shape_249.setTransform(150.25,318.825);

	this.shape_250 = new cjs.Shape();
	this.shape_250.graphics.f("#323232").s().p("AgiB/IAAj9IBFAAIAAD9g");
	this.shape_250.setTransform(99.7,318.825);

	this.shape_251 = new cjs.Shape();
	this.shape_251.graphics.f("#323232").s().p("AA9BlIAAhdQAAgggCgIQgDgIgJAAQgGAAgGAHIAACGIhBAAIAAhdQAAgfgCgJQgDgIgIAAQgGAAgGAHIAACGIhHAAIAAjHIBHAAIAAAYQARgZAYAAQAdgBAOAjQAXgjAZABQAOAAAKAGQALAHAFAOQAGANACANQACAOgBAhIAABkg");
	this.shape_251.setTransform(239,330.95);

	this.shape_252 = new cjs.Shape();
	this.shape_252.graphics.f("#323232").s().p("AgZAmQgLgQAAgWQAAgWALgPQALgQAOAAQAPAAALAQQALAPAAAWQAAAWgLAQQgLAQgPAAQgOAAgLgQg");
	this.shape_252.setTransform(503.975,336.65);

	this.shape_253 = new cjs.Shape();
	this.shape_253.graphics.f("#323232").s().p("AAcCAIglhPIAABNIhLAAIAAj9IA2AAIAoBWIAAhWIBLAAIAAD/g");
	this.shape_253.setTransform(136.35,329.05);

	this.shape_254 = new cjs.Shape();
	this.shape_254.graphics.f("#323232").s().p("AglB/IAAhvIhCiOIBNAAIAaA6IAbg6IBNAAIhCCOIAABvg");
	this.shape_254.setTransform(62.025,328.975);

	this.shape_255 = new cjs.Shape();
	this.shape_255.graphics.f("#323232").s().p("Ag7BXQgKgPAAgXQAAgbANgPQANgPAWAAQAJAAAMAFQAAgdgZAAQgVAAgUAPIAAg8QAbgXAoAAQAVAAAOAHQAOAHAIAOQAIAPACAPQACAOAAAeIAABiIhGAAIAAgPQgFAHgJAFQgKAEgIAAQgRAAgKgOgAgVAdQgDAFAAAHQAAAJADAGQAFAFAGAAQAHAAADgFIAAgcQgFgDgFAAQgGAAgFAEg");
	this.shape_255.setTransform(241.85,368.025);

	this.shape_256 = new cjs.Shape();
	this.shape_256.graphics.f("#323232").s().p("AgSB3QgIgLAAgRQAAgbASgKQgCgDgNgnQgOgnAAgjQAAgeAMgTQALgTAPAAQAQAAAKATQALATAAAeQAAAhgMAjQgLAlgGALQAIAFAFAKQAFAKAAAMQAAARgIALQgIAMgLAAQgKAAgIgMg");
	this.shape_256.setTransform(488.875,320.975);

	this.shape_257 = new cjs.Shape();
	this.shape_257.graphics.f("#323232").s().p("AgyBLQgVgdAAgyQAAgcAKgYQAKgYAQgMQAQgLAUAAQAMABAMAGQANAHAKANQALAMAFATQAGATABANIABAbIhHAAQADAQAKAIQAJAJALAAQAYgBAOgVIAAAjQgYAsgqgBQgjAAgVgcgAABgrQgDAIAAANIAAACIAfAAQAAgOgFgJQgEgJgHABQgHAAgFAIg");
	this.shape_257.setTransform(475.175,323.55);

	this.shape_258 = new cjs.Shape();
	this.shape_258.graphics.f("#323232").s().p("AgyBLQgVgdAAgyQAAgcAKgYQAKgYAQgMQAQgLAUAAQAMABAMAGQANAHAKANQALAMAFATQAGATABANIABAbIhHAAQADAQAKAIQAJAJALAAQAYgBAOgVIAAAjQgYAsgqgBQgjAAgVgcgAABgrQgDAIAAANIAAACIAfAAQAAgOgFgJQgEgJgHABQgHAAgFAIg");
	this.shape_258.setTransform(393.225,323.55);

	this.shape_259 = new cjs.Shape();
	this.shape_259.graphics.f("#323232").s().p("AgyBLQgVgdAAgyQAAgcAKgYQAKgYAQgMQAQgLAUAAQAMABAMAGQANAHAKANQALAMAFATQAGATABANIABAbIhHAAQADAQAKAIQAJAJALAAQAYgBAOgVIAAAjQgYAsgqgBQgjAAgVgcgAABgrQgDAIAAANIAAACIAfAAQAAgOgFgJQgEgJgHABQgHAAgFAIg");
	this.shape_259.setTransform(310.725,323.55);

	this.shape_260 = new cjs.Shape();
	this.shape_260.graphics.f("#323232").s().p("AgyBLQgVgdAAgyQAAgcAKgYQAKgYAQgMQAQgLAUAAQAMABAMAGQANAHAKANQALAMAFATQAGATABANIABAbIhHAAQADAQAKAIQAJAJALAAQAYgBAOgVIAAAjQgYAsgqgBQgjAAgVgcgAABgrQgDAIAAANIAAACIAfAAQAAgOgFgJQgEgJgHABQgHAAgFAIg");
	this.shape_260.setTransform(192.075,323.55);

	this.shape_261 = new cjs.Shape();
	this.shape_261.graphics.f("#323232").s().p("AgSB3QgIgLAAgRQAAgbASgKQgCgDgNgnQgOgnAAgjQAAgeAMgTQALgTAPAAQAQAAAKATQALATAAAeQAAAhgMAjQgLAlgGALQAIAFAFAKQAFAKAAAMQAAARgIALQgIAMgLAAQgKAAgIgMg");
	this.shape_261.setTransform(140.775,320.975);

	this.shape_262 = new cjs.Shape();
	this.shape_262.graphics.f("#323232").s().p("AAcB/IgbhlIgZBlIg4AAIg9j9IBLAAIATBTIAWhTIAzAAIAXBTIAThTIBKAAIg6D9g");
	this.shape_262.setTransform(82.975,320.975);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_28},{t:this.shape_27},{t:this.shape_26},{t:this.shape_25},{t:this.shape_24},{t:this.shape_23},{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12}]},114).to({state:[{t:this.shape_85},{t:this.shape_84,p:{x:47.875,y:316.625}},{t:this.shape_83},{t:this.shape_82},{t:this.shape_81},{t:this.shape_80},{t:this.shape_79},{t:this.shape_78,p:{x:168.525,y:319.3}},{t:this.shape_77},{t:this.shape_76,p:{x:196.625,y:316.625}},{t:this.shape_75,p:{x:221.725,y:316.575}},{t:this.shape_74},{t:this.shape_73,p:{x:248.65,y:316.575}},{t:this.shape_72,p:{x:261.575,y:319.3}},{t:this.shape_71},{t:this.shape_70,p:{x:297.225,y:316.725}},{t:this.shape_69,p:{x:313.575,y:319.325}},{t:this.shape_68,p:{x:341.575,y:316.725}},{t:this.shape_67,p:{x:355.5,y:316.575}},{t:this.shape_66},{t:this.shape_65,p:{x:382.275,y:316.625}},{t:this.shape_64,p:{x:398.725,y:316.725}},{t:this.shape_63,p:{x:417.025,y:316.725}},{t:this.shape_62,p:{x:434.55,y:319.425}},{t:this.shape_61},{t:this.shape_60,p:{x:477.95,y:319.425}},{t:this.shape_59,p:{x:495.525,y:319.35}},{t:this.shape_58,p:{x:513.825,y:316.725}},{t:this.shape_57,p:{x:28.35,y:361.075}},{t:this.shape_56,p:{x:37.15,y:353.875}},{t:this.shape_55},{t:this.shape_54,p:{x:85.275,y:360.975}},{t:this.shape_53,p:{x:101.725,y:361.075}},{t:this.shape_52},{t:this.shape_51,p:{x:134.325,y:363.675}},{t:this.shape_50,p:{x:152.65,y:363.775}},{t:this.shape_49,p:{x:168.95,y:360.925}},{t:this.shape_48,p:{x:183.075,y:363.7}},{t:this.shape_47,p:{x:200.975,y:366.575}},{t:this.shape_46,p:{x:230.525,y:361.075}},{t:this.shape_45},{t:this.shape_44,p:{x:264.2,y:363.675}},{t:this.shape_43,p:{x:290.7,y:363.775}},{t:this.shape_42,p:{x:317.175,y:363.675}},{t:this.shape_41},{t:this.shape_40,p:{x:351.3,y:363.675}},{t:this.shape_39},{t:this.shape_38,p:{x:385.2,y:363.675}},{t:this.shape_37,p:{x:397.15,y:360.925}},{t:this.shape_36,p:{x:408.875,y:363.675}},{t:this.shape_35},{t:this.shape_34},{t:this.shape_33,p:{x:470.2,y:363.775}},{t:this.shape_32,p:{x:486.75,y:363.675}},{t:this.shape_31,p:{x:500.425,y:360.975}},{t:this.shape_30,p:{x:516.125,y:366.575}},{t:this.shape_29,p:{x:526.625,y:368.75}}]},55).to({state:[{t:this.shape_57,p:{x:56.3,y:317.525}},{t:this.shape_117,p:{x:84.55,y:320.225}},{t:this.shape_43,p:{x:102.6,y:320.225}},{t:this.shape_116},{t:this.shape_84,p:{x:135.275,y:317.425}},{t:this.shape_76,p:{x:159.575,y:317.425}},{t:this.shape_115,p:{x:175.025,y:320.125}},{t:this.shape_68,p:{x:204.025,y:317.525}},{t:this.shape_114,p:{x:221.2,y:320.225}},{t:this.shape_113,p:{x:239,y:317.525}},{t:this.shape_112,p:{x:255.625,y:320.1}},{t:this.shape_64,p:{x:284.275,y:317.525}},{t:this.shape_111,p:{x:301.625,y:320.1}},{t:this.shape_110,p:{x:317.95,y:320.125}},{t:this.shape_109},{t:this.shape_108,p:{x:371.35,y:320.125}},{t:this.shape_107},{t:this.shape_106,p:{x:405,y:317.525}},{t:this.shape_105,p:{x:421.625,y:320.1}},{t:this.shape_104,p:{x:434.675,y:325.2}},{t:this.shape_103},{t:this.shape_60,p:{x:474.8,y:320.225}},{t:this.shape_102},{t:this.shape_30,p:{x:40.175,y:367.375}},{t:this.shape_51,p:{x:55.675,y:364.475}},{t:this.shape_101},{t:this.shape_53,p:{x:103.125,y:361.875}},{t:this.shape_100},{t:this.shape_99,p:{x:133.35,y:361.875}},{t:this.shape_98},{t:this.shape_97},{t:this.shape_96},{t:this.shape_95,p:{x:231.775,y:367.375}},{t:this.shape_94},{t:this.shape_65,p:{x:262.725,y:361.775}},{t:this.shape_54,p:{x:287.025,y:361.775}},{t:this.shape_46,p:{x:303.475,y:361.875}},{t:this.shape_93},{t:this.shape_92,p:{x:345,y:361.725}},{t:this.shape_91,p:{x:359.125,y:364.5}},{t:this.shape_47,p:{x:377.025,y:367.375}},{t:this.shape_44,p:{x:394.25,y:364.475}},{t:this.shape_90},{t:this.shape_58,p:{x:426.575,y:361.875}},{t:this.shape_89},{t:this.shape_88},{t:this.shape_87,p:{x:471.125,y:364.5}},{t:this.shape_31,p:{x:486.225,y:361.775}},{t:this.shape_36,p:{x:500.275,y:364.475}},{t:this.shape_86,p:{x:513.625,y:361.875}}]},90).to({state:[{t:this.shape_128},{t:this.shape_117,p:{x:122,y:333.575}},{t:this.shape_127},{t:this.shape_69,p:{x:155.575,y:333.475}},{t:this.shape_51,p:{x:171.175,y:333.475}},{t:this.shape_126,p:{x:193.35,y:333.5}},{t:this.shape_125},{t:this.shape_124,p:{x:227.975,y:330.875}},{t:this.shape_123,p:{x:255.275,y:330.875}},{t:this.shape_122},{t:this.shape_32,p:{x:291,y:333.475}},{t:this.shape_121,p:{x:306.225,y:333.45}},{t:this.shape_67,p:{x:330.4,y:330.725}},{t:this.shape_42,p:{x:342.125,y:333.475}},{t:this.shape_120},{t:this.shape_30,p:{x:395.775,y:336.375}},{t:this.shape_99,p:{x:420.45,y:330.875}},{t:this.shape_119,p:{x:430.1,y:330.725}},{t:this.shape_36,p:{x:441.825,y:333.475}},{t:this.shape_31,p:{x:454.975,y:330.775}},{t:this.shape_118,p:{x:466.775,y:338.55}}]},82).to({state:[{t:this.shape_151},{t:this.shape_150,p:{x:80.525,y:318.05}},{t:this.shape_149,p:{x:102.45,y:318.1}},{t:this.shape_148,p:{x:124.375,y:318.05}},{t:this.shape_147},{t:this.shape_68,p:{x:169.525,y:315.475}},{t:this.shape_146,p:{x:186.725,y:318.05}},{t:this.shape_38,p:{x:203.05,y:318.075}},{t:this.shape_84,p:{x:227.325,y:315.375}},{t:this.shape_64,p:{x:243.775,y:315.475}},{t:this.shape_145,p:{x:261.125,y:318.05}},{t:this.shape_67,p:{x:285.3,y:315.325}},{t:this.shape_76,p:{x:295.975,y:315.375}},{t:this.shape_144,p:{x:311.225,y:318.05}},{t:this.shape_143},{t:this.shape_42,p:{x:353.875,y:318.075}},{t:this.shape_62,p:{x:380.55,y:318.175}},{t:this.shape_142,p:{x:398.125,y:318.1}},{t:this.shape_58,p:{x:416.425,y:315.475}},{t:this.shape_141},{t:this.shape_37,p:{x:460.5,y:315.325}},{t:this.shape_140,p:{x:472.65,y:318.075}},{t:this.shape_106,p:{x:489.95,y:315.475}},{t:this.shape_65,p:{x:41.575,y:359.725}},{t:this.shape_53,p:{x:58.025,y:359.825}},{t:this.shape_139},{t:this.shape_138,p:{x:102.05,y:362.425}},{t:this.shape_137,p:{x:118.125,y:362.425}},{t:this.shape_136,p:{x:134.7,y:362.425}},{t:this.shape_110,p:{x:150.1,y:362.425}},{t:this.shape_135},{t:this.shape_134,p:{x:180.7,y:362.425}},{t:this.shape_54,p:{x:194.325,y:359.725}},{t:this.shape_115,p:{x:221.075,y:362.425}},{t:this.shape_133},{t:this.shape_132},{t:this.shape_50,p:{x:286.75,y:362.525}},{t:this.shape_46,p:{x:307.225,y:359.825}},{t:this.shape_112,p:{x:324.575,y:362.4}},{t:this.shape_131},{t:this.shape_30,p:{x:371.025,y:365.325}},{t:this.shape_51,p:{x:386.525,y:362.425}},{t:this.shape_130},{t:this.shape_36,p:{x:431.575,y:362.425}},{t:this.shape_111,p:{x:446.975,y:362.4}},{t:this.shape_105,p:{x:463.125,y:362.4}},{t:this.shape_129,p:{x:487.3,y:359.675}},{t:this.shape_31,p:{x:497.975,y:359.725}},{t:this.shape_104,p:{x:509.775,y:367.5}}]},48).to({state:[{t:this.shape_163},{t:this.shape_38,p:{x:70.3,y:317.525}},{t:this.shape_162},{t:this.shape_69,p:{x:100.475,y:317.525}},{t:this.shape_42,p:{x:114.675,y:317.525}},{t:this.shape_161,p:{x:136.5,y:307.725}},{t:this.shape_160},{t:this.shape_159},{t:this.shape_56,p:{x:179.35,y:307.725}},{t:this.shape_65,p:{x:199.775,y:314.825}},{t:this.shape_137,p:{x:215.225,y:317.525}},{t:this.shape_36,p:{x:241.725,y:317.525}},{t:this.shape_54,p:{x:254.875,y:314.825}},{t:this.shape_158},{t:this.shape_157},{t:this.shape_31,p:{x:300.325,y:314.825}},{t:this.shape_156,p:{x:312.125,y:322.6}},{t:this.shape_155},{t:this.shape_115,p:{x:131.125,y:361.875}},{t:this.shape_51,p:{x:147.725,y:361.875}},{t:this.shape_58,p:{x:165.075,y:359.275}},{t:this.shape_99,p:{x:190.65,y:359.275}},{t:this.shape_154,p:{x:204.675,y:362.05}},{t:this.shape_153},{t:this.shape_152,p:{x:238.65,y:359.275}},{t:this.shape_124,p:{x:251.825,y:359.275}}]},89).to({state:[]},33).to({state:[{t:this.shape_123,p:{x:81.375,y:328.475}},{t:this.shape_115,p:{x:101.975,y:331.075}},{t:this.shape_50,p:{x:121.3,y:331.175}},{t:this.shape_170},{t:this.shape_169,p:{x:182.85,y:331.175}},{t:this.shape_168},{t:this.shape_30,p:{x:219.025,y:333.975}},{t:this.shape_167},{t:this.shape_95,p:{x:266.525,y:333.975}},{t:this.shape_47,p:{x:285.125,y:333.975}},{t:this.shape_36,p:{x:301.975,y:331.075}},{t:this.shape_63,p:{x:331.625,y:328.475}},{t:this.shape_51,p:{x:350.375,y:331.075}},{t:this.shape_57,p:{x:377.5,y:328.475}},{t:this.shape_166},{t:this.shape_165},{t:this.shape_164},{t:this.shape_58,p:{x:459.275,y:328.475}},{t:this.shape_86,p:{x:475.775,y:328.475}}]},10).to({state:[]},31).to({state:[{t:this.shape_173,p:{x:219.05,y:329.4}},{t:this.shape_37,p:{x:235.15,y:329.175}},{t:this.shape_138,p:{x:248.3,y:331.925}},{t:this.shape_172},{t:this.shape_171,p:{x:291.55,y:331.875}},{t:this.shape_51,p:{x:307.375,y:331.925}},{t:this.shape_68,p:{x:326.075,y:329.325}},{t:this.shape_124,p:{x:340.825,y:329.325}}]},3).to({state:[]},15).to({state:[{t:this.shape_182,p:{x:59.225,y:329.125}},{t:this.shape_46,p:{x:83.275,y:329.125}},{t:this.shape_181},{t:this.shape_31,p:{x:116.375,y:329.025}},{t:this.shape_180},{t:this.shape_179,p:{x:160.7,y:328.975}},{t:this.shape_178},{t:this.shape_70,p:{x:195.125,y:329.125}},{t:this.shape_115,p:{x:226.175,y:331.725}},{t:this.shape_75,p:{x:242.125,y:328.975}},{t:this.shape_177},{t:this.shape_176,p:{x:295.65,y:328.975}},{t:this.shape_99,p:{x:306.3,y:329.125}},{t:this.shape_106,p:{x:321.65,y:329.125}},{t:this.shape_63,p:{x:352.525,y:329.125}},{t:this.shape_51,p:{x:371.275,y:331.725}},{t:this.shape_57,p:{x:398.4,y:329.125}},{t:this.shape_48,p:{x:426.575,y:331.75}},{t:this.shape_175},{t:this.shape_174,p:{x:462.075,y:331.7}},{t:this.shape_58,p:{x:480.175,y:329.125}},{t:this.shape_86,p:{x:496.675,y:329.125}}]},10).to({state:[]},31).to({state:[{t:this.shape_173,p:{x:218.6,y:329.75}},{t:this.shape_37,p:{x:234.7,y:329.525}},{t:this.shape_138,p:{x:247.85,y:332.275}},{t:this.shape_183},{t:this.shape_171,p:{x:291.1,y:332.225}},{t:this.shape_51,p:{x:306.925,y:332.275}},{t:this.shape_68,p:{x:325.625,y:329.675}},{t:this.shape_124,p:{x:340.375,y:329.675}}]},3).to({state:[]},15).to({state:[{t:this.shape_123,p:{x:70.925,y:330.225}},{t:this.shape_115,p:{x:91.525,y:332.825}},{t:this.shape_117,p:{x:110.85,y:332.925}},{t:this.shape_188},{t:this.shape_187},{t:this.shape_186},{t:this.shape_46,p:{x:209.275,y:330.225}},{t:this.shape_36,p:{x:238.725,y:332.825}},{t:this.shape_185,p:{x:256.225,y:333}},{t:this.shape_47,p:{x:275.225,y:335.725}},{t:this.shape_184,p:{x:293.25,y:332.925}},{t:this.shape_40,p:{x:310.8,y:332.825}},{t:this.shape_63,p:{x:340.275,y:330.225}},{t:this.shape_51,p:{x:359.025,y:332.825}},{t:this.shape_57,p:{x:386.15,y:330.225}},{t:this.shape_59,p:{x:414.325,y:332.85}},{t:this.shape_78,p:{x:432.675,y:332.8}},{t:this.shape_72,p:{x:449.825,y:332.8}},{t:this.shape_58,p:{x:467.925,y:330.225}},{t:this.shape_86,p:{x:484.425,y:330.225}}]},10).to({state:[]},31).to({state:[{t:this.shape_191},{t:this.shape_176,p:{x:235.35,y:331.875}},{t:this.shape_108,p:{x:248.5,y:334.625}},{t:this.shape_190},{t:this.shape_189},{t:this.shape_51,p:{x:307.575,y:334.625}},{t:this.shape_68,p:{x:326.275,y:332.025}},{t:this.shape_124,p:{x:341.025,y:332.025}}]},3).to({state:[]},15).to({state:[{t:this.shape_123,p:{x:74.575,y:331.475}},{t:this.shape_137,p:{x:95.175,y:334.075}},{t:this.shape_199,p:{x:114.5,y:334.175}},{t:this.shape_198},{t:this.shape_197},{t:this.shape_196,p:{x:194.85,y:334.075}},{t:this.shape_46,p:{x:212.925,y:331.475}},{t:this.shape_75,p:{x:242.125,y:331.325}},{t:this.shape_99,p:{x:253.9,y:331.475}},{t:this.shape_115,p:{x:268.025,y:334.075}},{t:this.shape_195},{t:this.shape_44,p:{x:305.15,y:334.075}},{t:this.shape_63,p:{x:334.625,y:331.475}},{t:this.shape_51,p:{x:353.375,y:334.075}},{t:this.shape_57,p:{x:380.5,y:331.475}},{t:this.shape_194},{t:this.shape_193},{t:this.shape_192},{t:this.shape_58,p:{x:462.275,y:331.475}},{t:this.shape_86,p:{x:478.775,y:331.475}}]},10).to({state:[]},31).to({state:[{t:this.shape_173,p:{x:218.95,y:331.1}},{t:this.shape_37,p:{x:235.05,y:330.875}},{t:this.shape_134,p:{x:248.2,y:333.625}},{t:this.shape_105,p:{x:265.075,y:333.6}},{t:this.shape_200},{t:this.shape_51,p:{x:307.275,y:333.625}},{t:this.shape_68,p:{x:325.975,y:331.025}},{t:this.shape_124,p:{x:340.725,y:331.025}}]},3).to({state:[]},15).to({state:[{t:this.shape_182,p:{x:31.725,y:329.925}},{t:this.shape_46,p:{x:55.775,y:329.925}},{t:this.shape_184,p:{x:74.1,y:332.625}},{t:this.shape_54,p:{x:88.875,y:329.825}},{t:this.shape_113,p:{x:118.85,y:329.925}},{t:this.shape_67,p:{x:133.2,y:329.775}},{t:this.shape_204},{t:this.shape_70,p:{x:167.625,y:329.925}},{t:this.shape_137,p:{x:198.675,y:332.525}},{t:this.shape_203},{t:this.shape_75,p:{x:241.275,y:329.775}},{t:this.shape_32,p:{x:257.25,y:332.525}},{t:this.shape_115,p:{x:273.325,y:332.525}},{t:this.shape_36,p:{x:289.525,y:332.525}},{t:this.shape_31,p:{x:303.675,y:329.825}},{t:this.shape_92,p:{x:316.65,y:329.775}},{t:this.shape_91,p:{x:331.775,y:332.55}},{t:this.shape_47,p:{x:350.675,y:335.425}},{t:this.shape_63,p:{x:381.975,y:329.925}},{t:this.shape_51,p:{x:400.725,y:332.525}},{t:this.shape_57,p:{x:427.85,y:329.925}},{t:this.shape_87,p:{x:456.025,y:332.55}},{t:this.shape_202},{t:this.shape_201},{t:this.shape_58,p:{x:509.625,y:329.925}},{t:this.shape_86,p:{x:526.125,y:329.925}}]},10).to({state:[]},31).to({state:[{t:this.shape_123,p:{x:62.875,y:315.825}},{t:this.shape_215},{t:this.shape_214},{t:this.shape_213},{t:this.shape_212,p:{x:165.925}},{t:this.shape_211,p:{x:176.325}},{t:this.shape_156,p:{x:186.725,y:323.5}},{t:this.shape_84,p:{x:208.575,y:315.725}},{t:this.shape_53,p:{x:226.025,y:315.825}},{t:this.shape_43,p:{x:244.35,y:318.525}},{t:this.shape_76,p:{x:259.125,y:315.725}},{t:this.shape_161,p:{x:270.5,y:308.625}},{t:this.shape_36,p:{x:281.675,y:318.425}},{t:this.shape_210,p:{x:311.575,y:318.45}},{t:this.shape_51,p:{x:330.125,y:318.425}},{t:this.shape_65,p:{x:345.275,y:315.725}},{t:this.shape_209,p:{x:37.425,y:365.675}},{t:this.shape_154,p:{x:57.125,y:362.95}},{t:this.shape_92,p:{x:72.3,y:360.025}},{t:this.shape_54,p:{x:83.975,y:360.075}},{t:this.shape_174,p:{x:100.225,y:362.75}},{t:this.shape_110,p:{x:129.85,y:362.775}},{t:this.shape_73,p:{x:142.8,y:360.025}},{t:this.shape_95,p:{x:157.275,y:365.675}},{t:this.shape_46,p:{x:176.525,y:360.175}},{t:this.shape_31,p:{x:192.625,y:360.075}},{t:this.shape_29,p:{x:205.425,y:367.85}},{t:this.shape_208,p:{x:227.4,y:360.175}},{t:this.shape_207,p:{x:244.1,y:362.775}},{t:this.shape_30,p:{x:260.925,y:365.675}},{t:this.shape_206},{t:this.shape_47,p:{x:308.775,y:365.675}},{t:this.shape_205},{t:this.shape_37,p:{x:340.9,y:360.025}},{t:this.shape_48,p:{x:356.025,y:362.8}},{t:this.shape_124,p:{x:370.925,y:360.175}}]},5).to({state:[]},26).to({state:[{t:this.shape_123,p:{x:62.775,y:315.125}},{t:this.shape_126,p:{x:88.95,y:317.75}},{t:this.shape_221},{t:this.shape_220},{t:this.shape_219},{t:this.shape_218},{t:this.shape_118,p:{x:186.625,y:322.8}},{t:this.shape_84,p:{x:208.475,y:315.025}},{t:this.shape_53,p:{x:225.925,y:315.125}},{t:this.shape_217},{t:this.shape_76,p:{x:259.025,y:315.025}},{t:this.shape_161,p:{x:270.4,y:307.925}},{t:this.shape_36,p:{x:281.575,y:317.725}},{t:this.shape_216,p:{x:311.475,y:317.75}},{t:this.shape_51,p:{x:330.025,y:317.725}},{t:this.shape_65,p:{x:345.175,y:315.025}},{t:this.shape_209,p:{x:37.325,y:364.975}},{t:this.shape_185,p:{x:57.025,y:362.25}},{t:this.shape_49,p:{x:72.2,y:359.325}},{t:this.shape_54,p:{x:83.875,y:359.375}},{t:this.shape_72,p:{x:100.125,y:362.05}},{t:this.shape_136,p:{x:129.75,y:362.075}},{t:this.shape_179,p:{x:142.7,y:359.325}},{t:this.shape_95,p:{x:157.175,y:364.975}},{t:this.shape_46,p:{x:176.425,y:359.475}},{t:this.shape_31,p:{x:192.525,y:359.375}},{t:this.shape_104,p:{x:205.325,y:367.15}},{t:this.shape_208,p:{x:227.3,y:359.475}},{t:this.shape_38,p:{x:244,y:362.075}},{t:this.shape_30,p:{x:260.825,y:364.975}},{t:this.shape_60,p:{x:290.75,y:362.175}},{t:this.shape_47,p:{x:308.675,y:364.975}},{t:this.shape_43,p:{x:326.7,y:362.175}},{t:this.shape_37,p:{x:340.8,y:359.325}},{t:this.shape_59,p:{x:355.925,y:362.1}},{t:this.shape_124,p:{x:370.825,y:359.475}}]},4).to({state:[]},26).to({state:[{t:this.shape_123,p:{x:63.575,y:315.825}},{t:this.shape_226},{t:this.shape_225},{t:this.shape_224},{t:this.shape_212,p:{x:166.625}},{t:this.shape_211,p:{x:177.025}},{t:this.shape_156,p:{x:187.425,y:323.5}},{t:this.shape_84,p:{x:209.275,y:315.725}},{t:this.shape_53,p:{x:226.725,y:315.825}},{t:this.shape_114,p:{x:245.05,y:318.525}},{t:this.shape_76,p:{x:259.825,y:315.725}},{t:this.shape_161,p:{x:271.2,y:308.625}},{t:this.shape_36,p:{x:282.375,y:318.425}},{t:this.shape_210,p:{x:312.275,y:318.45}},{t:this.shape_51,p:{x:330.825,y:318.425}},{t:this.shape_65,p:{x:345.975,y:315.725}},{t:this.shape_209,p:{x:38.125,y:365.675}},{t:this.shape_154,p:{x:57.825,y:362.95}},{t:this.shape_67,p:{x:73,y:360.025}},{t:this.shape_54,p:{x:84.675,y:360.075}},{t:this.shape_174,p:{x:100.925,y:362.75}},{t:this.shape_44,p:{x:130.55,y:362.775}},{t:this.shape_129,p:{x:143.5,y:360.025}},{t:this.shape_95,p:{x:157.975,y:365.675}},{t:this.shape_46,p:{x:177.225,y:360.175}},{t:this.shape_31,p:{x:193.325,y:360.075}},{t:this.shape_29,p:{x:206.125,y:367.85}},{t:this.shape_223,p:{y:360.175}},{t:this.shape_38,p:{x:244.8,y:362.775}},{t:this.shape_30,p:{x:261.625,y:365.675}},{t:this.shape_33,p:{x:291.55,y:362.875}},{t:this.shape_47,p:{x:309.475,y:365.675}},{t:this.shape_222,p:{y:362.875,x:327.5}},{t:this.shape_179,p:{x:341.6,y:360.025}},{t:this.shape_48,p:{x:356.725,y:362.8}},{t:this.shape_124,p:{x:371.625,y:360.175}}]},4).to({state:[]},26).to({state:[{t:this.shape_123,p:{x:63.575,y:315.775}},{t:this.shape_234},{t:this.shape_233},{t:this.shape_232},{t:this.shape_231},{t:this.shape_230},{t:this.shape_229},{t:this.shape_84,p:{x:209.275,y:315.675}},{t:this.shape_53,p:{x:226.725,y:315.775}},{t:this.shape_114,p:{x:245.05,y:318.475}},{t:this.shape_76,p:{x:259.825,y:315.675}},{t:this.shape_161,p:{x:271.2,y:308.575}},{t:this.shape_36,p:{x:282.375,y:318.375}},{t:this.shape_228},{t:this.shape_51,p:{x:330.825,y:318.375}},{t:this.shape_65,p:{x:345.975,y:315.675}},{t:this.shape_209,p:{x:38.125,y:365.625}},{t:this.shape_227},{t:this.shape_67,p:{x:73,y:359.975}},{t:this.shape_54,p:{x:84.675,y:360.025}},{t:this.shape_121,p:{x:100.925,y:362.7}},{t:this.shape_44,p:{x:130.55,y:362.725}},{t:this.shape_129,p:{x:143.5,y:359.975}},{t:this.shape_95,p:{x:157.975,y:365.625}},{t:this.shape_46,p:{x:177.225,y:360.125}},{t:this.shape_31,p:{x:193.325,y:360.025}},{t:this.shape_118,p:{x:206.125,y:367.8}},{t:this.shape_223,p:{y:360.125}},{t:this.shape_38,p:{x:244.8,y:362.725}},{t:this.shape_30,p:{x:261.625,y:365.625}},{t:this.shape_33,p:{x:291.55,y:362.825}},{t:this.shape_47,p:{x:309.475,y:365.625}},{t:this.shape_222,p:{y:362.825,x:327.5}},{t:this.shape_179,p:{x:341.6,y:359.975}},{t:this.shape_216,p:{x:356.725,y:362.75}},{t:this.shape_124,p:{x:371.625,y:360.125}}]},4).to({state:[]},26).to({state:[{t:this.shape_123,p:{x:63.575,y:315.775}},{t:this.shape_234},{t:this.shape_233},{t:this.shape_232},{t:this.shape_231},{t:this.shape_230},{t:this.shape_229},{t:this.shape_84,p:{x:209.275,y:315.675}},{t:this.shape_53,p:{x:226.725,y:315.775}},{t:this.shape_114,p:{x:245.05,y:318.475}},{t:this.shape_76,p:{x:259.825,y:315.675}},{t:this.shape_161,p:{x:271.2,y:308.575}},{t:this.shape_36,p:{x:282.375,y:318.375}},{t:this.shape_228},{t:this.shape_51,p:{x:330.825,y:318.375}},{t:this.shape_65,p:{x:345.975,y:315.675}},{t:this.shape_209,p:{x:38.125,y:365.625}},{t:this.shape_227},{t:this.shape_67,p:{x:73,y:359.975}},{t:this.shape_54,p:{x:84.675,y:360.025}},{t:this.shape_121,p:{x:100.925,y:362.7}},{t:this.shape_44,p:{x:130.55,y:362.725}},{t:this.shape_129,p:{x:143.5,y:359.975}},{t:this.shape_95,p:{x:157.975,y:365.625}},{t:this.shape_46,p:{x:177.225,y:360.125}},{t:this.shape_31,p:{x:193.325,y:360.025}},{t:this.shape_118,p:{x:206.125,y:367.8}},{t:this.shape_223,p:{y:360.125}},{t:this.shape_38,p:{x:244.8,y:362.725}},{t:this.shape_30,p:{x:261.625,y:365.625}},{t:this.shape_33,p:{x:291.55,y:362.825}},{t:this.shape_47,p:{x:309.475,y:365.625}},{t:this.shape_222,p:{y:362.825,x:327.5}},{t:this.shape_179,p:{x:341.6,y:359.975}},{t:this.shape_216,p:{x:356.725,y:362.75}},{t:this.shape_124,p:{x:371.625,y:360.125}}]},4).to({state:[]},26).to({state:[{t:this.shape_237},{t:this.shape_119,p:{x:234.8,y:329.375}},{t:this.shape_196,p:{x:247.95,y:332.125}},{t:this.shape_236},{t:this.shape_235},{t:this.shape_51,p:{x:307.025,y:332.125}},{t:this.shape_68,p:{x:325.725,y:329.525}},{t:this.shape_124,p:{x:340.475,y:329.525}}]},4).to({state:[]},15).to({state:[{t:this.shape_57,p:{x:62,y:318.825}},{t:this.shape_84,p:{x:74.425,y:318.725}},{t:this.shape_250},{t:this.shape_137,p:{x:113.825,y:321.425}},{t:this.shape_115,p:{x:131.425,y:321.425}},{t:this.shape_249},{t:this.shape_42,p:{x:166.675,y:321.425}},{t:this.shape_248},{t:this.shape_73,p:{x:202.75,y:318.675}},{t:this.shape_113,p:{x:218.1,y:318.825}},{t:this.shape_247},{t:this.shape_50,p:{x:268.45,y:321.525}},{t:this.shape_246},{t:this.shape_64,p:{x:318.725,y:318.825}},{t:this.shape_43,p:{x:337.05,y:321.525}},{t:this.shape_245},{t:this.shape_244},{t:this.shape_243},{t:this.shape_242},{t:this.shape_99,p:{x:424.75,y:318.825}},{t:this.shape_76,p:{x:448.725,y:318.725}},{t:this.shape_53,p:{x:466.175,y:318.825}},{t:this.shape_241},{t:this.shape_67,p:{x:43.75,y:363.025}},{t:this.shape_240},{t:this.shape_47,p:{x:77.775,y:368.675}},{t:this.shape_239},{t:this.shape_150,p:{x:112.225,y:365.75}},{t:this.shape_58,p:{x:130.325,y:363.175}},{t:this.shape_37,p:{x:145.6,y:363.025}},{t:this.shape_148,p:{x:159.525,y:365.75}},{t:this.shape_142,p:{x:177.875,y:365.8}},{t:this.shape_65,p:{x:193.975,y:363.075}},{t:this.shape_36,p:{x:209.025,y:365.775}},{t:this.shape_54,p:{x:235.475,y:363.075}},{t:this.shape_51,p:{x:251.925,y:365.775}},{t:this.shape_149,p:{x:287.4,y:365.8}},{t:this.shape_114,p:{x:310.3,y:365.875}},{t:this.shape_152,p:{x:329.1,y:363.175}},{t:this.shape_146,p:{x:346.725,y:365.75}},{t:this.shape_31,p:{x:373.925,y:363.075}},{t:this.shape_46,p:{x:391.375,y:363.175}},{t:this.shape_145,p:{x:409.725,y:365.75}},{t:this.shape_108,p:{x:438.4,y:365.775}},{t:this.shape_184,p:{x:455.25,y:365.875}},{t:this.shape_238},{t:this.shape_144,p:{x:491.675,y:365.75}},{t:this.shape_124,p:{x:505.375,y:363.175}}]},6).to({state:[{t:this.shape_57,p:{x:144.9,y:328.325}},{t:this.shape_65,p:{x:157.325,y:328.225}},{t:this.shape_161,p:{x:168.7,y:321.125}},{t:this.shape_36,p:{x:179.875,y:330.925}},{t:this.shape_54,p:{x:206.325,y:328.225}},{t:this.shape_37,p:{x:219.3,y:328.175}},{t:this.shape_251},{t:this.shape_111,p:{x:261.925,y:330.9}},{t:this.shape_31,p:{x:289.125,y:328.225}},{t:this.shape_51,p:{x:305.575,y:330.925}},{t:this.shape_68,p:{x:336.575,y:328.325}},{t:this.shape_169,p:{x:354.75,y:331.025}},{t:this.shape_113,p:{x:373.55,y:328.325}},{t:this.shape_105,p:{x:391.175,y:330.9}},{t:this.shape_124,p:{x:404.875,y:328.325}}]},970).to({state:[{t:this.shape_254},{t:this.shape_43,p:{x:77.4,y:331.675}},{t:this.shape_30,p:{x:93.875,y:334.475}},{t:this.shape_124,p:{x:108.075,y:328.975}},{t:this.shape_253},{t:this.shape_115,p:{x:155.925,y:331.575}},{t:this.shape_199,p:{x:175.25,y:331.675}},{t:this.shape_99,p:{x:204.85,y:328.975}},{t:this.shape_146,p:{x:218.775,y:331.55}},{t:this.shape_65,p:{x:233.675,y:328.875}},{t:this.shape_56,p:{x:245.05,y:321.775}},{t:this.shape_42,p:{x:256.225,y:331.575}},{t:this.shape_75,p:{x:283.475,y:328.825}},{t:this.shape_207,p:{x:299.45,y:331.575}},{t:this.shape_51,p:{x:315.525,y:331.575}},{t:this.shape_36,p:{x:331.725,y:331.575}},{t:this.shape_54,p:{x:345.875,y:328.875}},{t:this.shape_31,p:{x:372.175,y:328.875}},{t:this.shape_46,p:{x:389.625,y:328.975}},{t:this.shape_145,p:{x:407.975,y:331.55}},{t:this.shape_140,p:{x:436.65,y:331.575}},{t:this.shape_222,p:{y:331.675,x:453.5}},{t:this.shape_152,p:{x:472.3,y:328.975}},{t:this.shape_144,p:{x:489.925,y:331.55}},{t:this.shape_252}]},180).to({state:[{t:this.shape_262},{t:this.shape_115,p:{x:104.325,y:323.575}},{t:this.shape_50,p:{x:123.65,y:323.675}},{t:this.shape_261},{t:this.shape_182,p:{x:170.925,y:320.975}},{t:this.shape_260},{t:this.shape_75,p:{x:220.075,y:320.825}},{t:this.shape_67,p:{x:231.85,y:320.825}},{t:this.shape_216,p:{x:246.975,y:323.6}},{t:this.shape_37,p:{x:262.05,y:320.825}},{t:this.shape_36,p:{x:274.775,y:323.575}},{t:this.shape_64,p:{x:292.375,y:320.975}},{t:this.shape_259},{t:this.shape_58,p:{x:328.825,y:320.975}},{t:this.shape_31,p:{x:357.425,y:320.875}},{t:this.shape_53,p:{x:374.875,y:320.975}},{t:this.shape_258},{t:this.shape_134,p:{x:421.9,y:323.575}},{t:this.shape_43,p:{x:438.75,y:323.675}},{t:this.shape_106,p:{x:457.55,y:320.975}},{t:this.shape_257},{t:this.shape_256},{t:this.shape_208,p:{x:205.1,y:365.325}},{t:this.shape_46,p:{x:223.525,y:365.325}},{t:this.shape_255},{t:this.shape_210,p:{x:260.425,y:367.95}},{t:this.shape_113,p:{x:280.2,y:365.325}},{t:this.shape_30,p:{x:310.575,y:370.825}},{t:this.shape_51,p:{x:327.075,y:367.925}},{t:this.shape_185,p:{x:345.575,y:368.1}},{t:this.shape_124,p:{x:360.575,y:365.325}}]},128).to({state:[]},295).wait(499));

	// woman
	this.instance_63 = new lib.Person_gr("synched",0);
	this.instance_63.setTransform(645.95,166.7,0.4276,0.4276,0,0,0,344.6,250.5);
	this.instance_63._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_63).wait(73).to({_off:false},0).to({regY:250.6,scaleX:0.4277,scaleY:0.4277,x:382},36).to({_off:true},2427).wait(500));

	// blur
	this.instance_64 = new lib.blur_gr("synched",0);
	this.instance_64.setTransform(275.6,200.25,1.0107,1.2656,0,0,0,327.7,150.3);
	this.instance_64.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_64).to({alpha:0.6016},23).to({_off:true},49).wait(2964));

	// background
	this.instance_65 = new lib.background_gr("synched",0);
	this.instance_65.setTransform(266,211.6,0.9216,0.9216,0,0,0,387.6,239.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_65).wait(1470).to({startPosition:0},0).to({_off:true},1066).wait(500));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(-216.3,0,946,417.3);
// library properties:
lib.properties = {
	id: '215D69CD4729D04093908871E2E05B32',
	width: 550,
	height: 400,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"sounds/alarmclock.mp3?1681677259303", id:"alarmclock"},
		{src:"sounds/clicksound.mp3?1681677259303", id:"clicksound"},
		{src:"sounds/clocktick.mp3?1681677259303", id:"clocktick"},
		{src:"sounds/eggcrack3egg.mp3?1681677259303", id:"eggcrack3egg"},
		{src:"sounds/eggtaponbowlbutnotcrack.mp3?1681677259303", id:"eggtaponbowlbutnotcrack"},
		{src:"sounds/frosting.mp3?1681677259303", id:"frosting"},
		{src:"sounds/mixingdoughbowlwithspoon01.mp3?1681677259303", id:"mixingdoughbowlwithspoon01"},
		{src:"sounds/pourcake.mp3?1681677259303", id:"pourcake"},
		{src:"sounds/pouringglassofmilk.mp3?1681677259303", id:"pouringglassofmilk"},
		{src:"sounds/sugarpour.mp3?1681677259303", id:"sugarpour"},
		{src:"sounds/sunnydayquiet.mp3?1681677259303", id:"sunnydayquiet"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['215D69CD4729D04093908871E2E05B32'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}
an.handleFilterCache = function(event) {
	if(!event.paused){
		var target = event.target;
		if(target){
			if(target.filterCacheList){
				for(var index = 0; index < target.filterCacheList.length ; index++){
					var cacheInst = target.filterCacheList[index];
					if((cacheInst.startFrame <= target.currentFrame) && (target.currentFrame <= cacheInst.endFrame)){
						cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				}
			}
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;