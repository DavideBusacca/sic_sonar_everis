var DEFAULT_SOUND_DURATION = 2;
var NUM_CATEGORIES = 0;


function audioInit(){
    var limiter = new Tone.Limiter(-3); // in dB
    var sampler = new Tone.Sampler( );

    var samplerVolume = new Tone.Volume(-24);
    var samplerDistortion = new Tone.Distortion(0);
    sampler.chain(samplerDistortion, samplerVolume, Tone.Master);

    Tone.Master.chain(limiter);

    return [sampler, samplerDistortion]

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

