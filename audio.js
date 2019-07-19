var DEFAULT_SOUND_DURATION = 2;
var NUM_CATEGORIES = 0;
var MAXIMUM_DISTORTION = 0.4;
var MAXIMUM_LFO = 1;


function audioInit(sampler=null, drumSampler=null, limiter=null, lfoSamplerDistortion=null, pingPong=null,
                   bpmValue=120, distortionAmount=1){
    try{
        lfoSamplerDistortion.dispose();
        pingPong.dispose();
        limiter.dispose();
        sampler.dispose();
        drumSampler.dispose();
    }
    catch(err){
        console.log(err);
    }

    Tone.Transport.bpm.value = bpmValue;
    console.log("BPM: " + Tone.Transport.bpm.value);
    var limiter = new Tone.Limiter(-3); // in dB
    var sampler = new Tone.Sampler( );

    var samplerVolume = new Tone.Volume(-18);
    var samplerDistortion = new Tone.Distortion(distortionAmount*MAXIMUM_DISTORTION);
    sampler.chain(samplerVolume, samplerDistortion, Tone.Master);

    console.log("Distortion amount: " + distortionAmount);
    var lfoSamplerDistortion = new Tone.LFO({
        "min" : 0,
        "max" : distortionAmount*MAXIMUM_LFO,
        "frequency" : "1n"
    });
    lfoSamplerDistortion.connect(samplerDistortion).start();

    var pingPong = new Tone.PingPongDelay({
        "delayTime": "16n",
        "feedback": 0.1,
        "wet": 0.15
    })


    var drumSampler = new Tone.Sampler({
        "c1": "https://s3-us-west-2.amazonaws.com/s.cdpn.io/152714/Kick_11.wav",
        "c#1": "https://s3-us-west-2.amazonaws.com/s.cdpn.io/152714/clap_2.wav",
        "d1": "https://s3-us-west-2.amazonaws.com/s.cdpn.io/152714/46.wav"
    });


    var drumSamplerVolume = new Tone.Volume(-12);
    drumSampler.chain(drumSamplerVolume, Tone.Master);


    var possiblePatterns = [2, 3, 4, 5, 6, 7, 9, 10];

    var patterns = [
        {   "size" : possiblePatterns[getRandomIntArbitrary(0, possiblePatterns.length)],
            "note" : "c1",
            "position" : 0
        },
        {   "size" : possiblePatterns[getRandomIntArbitrary(0, possiblePatterns.length)],
            "note" : "c#1",
            "position" : 0
        }
    ]

    console.log("Rythmic patterns: " + JSON.stringify(patterns));

// Start the sequence
    var stepNumber = 0;
    var numberOfSteps = 32;
    var scoreId = -1;

    Tone.Transport.scheduleRepeat(function(time){
        console

        for (let p = 0; p < patterns.length; p++) {
            patterns[p] = checkAndPlay(drumSampler, patterns[p], scoreId, time);
        }

        stepNumber++;
        stepNumber = stepNumber % numberOfSteps;

    }, "16n");

    Tone.Master.chain(pingPong, limiter);

    Tone.Transport.pause();
    Tone.Transport.start();

    return [sampler, drumSampler, limiter, lfoSamplerDistortion, pingPong]

}

function checkAndPlay(drumSampler, pattern, scoreId, time){
    let doIHaveToPlay = pattern.position % pattern.size; // when this is 0, play!
    if (doIHaveToPlay == 0) {
        try{
            drumSampler.triggerAttackRelease(pattern.note, "32n", time);
        }
        catch(err){
            print(err)
        }
    }

    pattern.position = pattern.position + 1;

    return pattern;

}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomIntArbitrary(min, max) {
    return Math.ceil(Math.random() * (max - min) + min) - 1;
}

function playEvent(category){
    category = category % NUM_CATEGORIES; //debug
    try{
        indexToPlay = getRandomIntArbitrary(0, notes[category].length);
        noteToPlay = (notes[category][indexToPlay]);
        sampler.triggerAttackRelease(noteToPlay, DEFAULT_SOUND_DURATION, Tone.now()); // "32n"
    }
    catch(err){
        print(err)
    }
}

function updateSounds(sounds){ //, duration
    var idx = 0;
    console.log(sounds);
    NUM_CATEGORIES = sounds.length;
    for (let i = 0; i < sounds.length; i++){
        soundsInCategory = sounds[i];
        notesInCategory = [];
        for (let l = 0; l < soundsInCategory.length; l++){
            note = Tone.Frequency(idx, "midi").toNote();
            notesInCategory.push(note);
            console.log(soundsInCategory[l])
            sampler.add(note, soundsInCategory[l]["previews"]["preview-lq-ogg"]);
            console.log("Updated " + soundsInCategory[l]["previews"]["preview-lq-ogg"] + " to " + note);
            idx += 1;
        }
        notes.push(notesInCategory);
    }
    console.log(notes);
    return notes;
}

