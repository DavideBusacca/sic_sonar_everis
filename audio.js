var synth = new Tone.PolySynth(4, Tone.MonoSynth, {
    "oscillator" : {
        "type" : "square8"
    },
    "envelope" : {
        "attack" : 0.05,
        "decay" : 0.3,
        "sustain" : 0.5,
        "release" : 0.8,
    },
    "filterEnvelope" : {
        "attack" : 0.001,
        "decay" : 0.7,
        "sustain" : 0.1,
        "release" : 0.8,
        "baseFrequency" : 300,
        "octaves" : 4
    }
}).toMaster();


d3.select("myId").on("click", function(d,i) { console.log("You just pressed me") });

function wrapper(d, i){
    console.log("You just pressed barri #" + d.properties.C_Barri + " with ID: " + i)
    noteToPlay = Tone.Frequency(d.properties.C_Barri, "midi").toNote();
    console.log("Playing note: " + noteToPlay);
    synth.triggerRelease ( )
    synth.triggerAttackRelease(noteToPlay, "8n", Tone.context.currentTime);
}
