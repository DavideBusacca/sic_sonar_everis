var DEFAULT_SOUND_DURATION = 10;


function audioInit(){
    var limiter = new Tone.Limiter(-3); // in dB
    var sampler = new Tone.Sampler( );

    var samplerVolume = new Tone.Volume(-24);
    // var samplerDistortion = new Tone.Distortion(2.5);
    // sampler.chain(samplerDistortion, samplerVolume);
    sampler.chain(samplerVolume, Tone.Master);
    Tone.Master.chain(limiter);

    return sampler

}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomIntArbitrary(min, max) {
    return Math.ceil(Math.random() * (max - min) + min) - 1;
}

function playEvent(category){
    category = category % 2; //debug
    indexToPlay = getRandomIntArbitrary(0, notes[category].length);
    noteToPlay = (notes[category][indexToPlay]);

    try{
        sampler.triggerAttackRelease(noteToPlay, DEFAULT_SOUND_DURATION, Tone.now()); // "32n"
    }
    catch(err){
        print("opsss!")
    }
}

var urls = [
    ["https://freesound.org/data/previews/181/181736_351215-lq.ogg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/152714/Kick_11.wav",],
    ["https://s3-us-west-2.amazonaws.com/s.cdpn.io/152714/clap_2.wav",
    "https://freesound.org/data/previews/86/86660_14771-lq.ogg"]
    ];

function updateSounds(urls){ //, duration
    var idx = 0;
    for (let i = 0; i < urls.length; i++){
        urlsInCategory = urls[i];
        notesInCategory = [];
        for (let l = 0; l < urlsInCategory.length; l++){
            note = Tone.Frequency(idx, "midi").toNote();
            notesInCategory.push(note);
            sampler.add(note, urlsInCategory[l]);
            // console.log("Updated " + urls[i][l] + " to " + note);
            idx += 1;
        }
        notes.push(notesInCategory);
    }
    console.log(notes);
    return notes;
}

