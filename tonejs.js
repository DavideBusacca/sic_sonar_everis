// Sampler
var sampler = new Tone.Sampler({
    "c1": "https://s3-us-west-2.amazonaws.com/s.cdpn.io/152714/Kick_11.wav"
});
var samplerVolume = new Tone.Volume(-7);
var samplerDistortion = new Tone.Distortion(2.5);
sampler.chain(samplerDistortion, samplerVolume);
sampler.chain(samplerVolume, Tone.Master);

// Score
var score = [
    {
        "samplerNotes":[["c1"],null,["c1"],null,["c1", "c1"],null,["c1", "c1"],["c1"]]
    }
];
var basslineNotesPosition = 0;
var samplerNotesPosition = 0;

// Start the sequence
var stepNumber = 0;
var numberOfSteps = 32;
var scoreId = -1;

Tone.Transport.bpm.value = 115;

Tone.Transport.scheduleRepeat(function(time){

    // Let's start the video every X beats
    if(stepNumber == 0) {
        scoreId++;
        // Score to play
        // XXX: Should depend on the video tags
        // XXX: Now just a modulo on the current sequence ID
        scoreId = scoreId % score.length;
    }

    // Playing the sampler
    if (score[scoreId].samplerNotes) {
        var samplerNote =
            score[scoreId].samplerNotes[samplerNotesPosition++];
        samplerNotesPosition =
            samplerNotesPosition % score[scoreId].samplerNotes.length;
        if (samplerNote != null) {
            sampler.triggerAttackRelease(samplerNote,
                "32n",
                time);
        }
    }

    stepNumber++;
    stepNumber = stepNumber % numberOfSteps;

}, "16n");

var playing = false;
var playPauseButton = document.getElementById("barri_01.q5-9");

Tone.Buffer.onload = function(){
    // Start the music
    Tone.Transport.start();
    //Tone.Transport.loopEnd = "1m";
    //Tone.Transport.loop = true;
    playPauseButton.innerHTML = "Pause";
    playing = true;
};

playPauseButton.addEventListener("click", function() {
    if (playing) {
        Tone.Transport.pause();
        playPauseButton.innerHTML = "Play";
        playing = false;
    } else {
        // Start the music
        Tone.Transport.start();
        //Tone.Transport.loopEnd = "1m";
        //Tone.Transport.loop = true;
        playPauseButton.innerHTML = "Pause";
        playing = true;
    }
});

/**************************************************
 * Utilities functions
 **************************************************/

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
