import { Component, OnInit } from '@angular/core';
import { start, Synth } from 'tone';
// http://passyworldofmathematics.com/guitar-mathematics/#:~:text=The%20open%20strings%20on%20a,to%20work%20out%20the%20note.
// https://www.piano-keyboard-guide.com/pentatonic-scale.html
// https://hubguitar.com/music-theory/constructing-the-minor-scale

export interface Note {
  note: string;
  fret: number;
  selected: boolean;
  oktave: number;
  isRoot: boolean;
  finger?: number;
  hide?: boolean;
}

export interface StringObject {
  notes: Note[];
}

export interface Scale {
  name: string;
  intervals: number[];
}

export interface RecordingStep {
  notes: RecordedNote[];
  active: boolean;
}

export interface RecordedNote {
  stringNum: number;
  noteNum: number;
}

@Component({
  selector: 'app-fretboard',
  templateUrl: './fretboard.component.html',
  styleUrls: ['./fretboard.component.scss'],
})
export class FretboardComponent implements OnInit {


  steps: any = [];


  frets = 22;

  fretsArray = new Array(this.frets).fill(0);

  noteMap = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'H']; // One Oktave

  // major scale: whole, whole, half, whole, whole, whole, half
  // 2,2,1,2,2,2,1

  // minor scale: whole, half, whole, whole, half, whole, whole
  // 2,1,2,2,1,2,2

  // pentatonic
  // major W, W, W+H, W, W+H
  // minor W+H, W, W, W+H, W

  showNotesNotInScale = false;

  scales: Scale[] = [
    {
      name: 'Major',
      intervals: [2, 2, 1, 2, 2, 2, 1],
    },
    {
      name: 'Minor',
      intervals: [2, 1, 2, 2, 1, 2, 2],
    },
    {
      name: 'Major Pentatonic',
      intervals: [2, 2, 3, 2, 3],
    },
    {
      name: 'Minor Pentatonic',
      intervals: [3, 2, 2, 3, 2],
    },
  ];

  // minor scale:

  tuning = [
    { note: 'E', oktave: 2 },
    { note: 'A', oktave: 2 },
    { note: 'D', oktave: 3 },
    { note: 'G', oktave: 3 },
    { note: 'H', oktave: 3 },
    { note: 'E', oktave: 4 },
  ];

  stringObjects: StringObject[] = [];

  constructor() {}

  playNote(note: any) {
    const synth = new Synth().toDestination();

    let noteName = note.note;
    if (noteName === 'H') {
      noteName = 'B';
    }
    synth.triggerAttackRelease(noteName + note.oktave, '8n');
  }
  ngOnInit(): void {
    this.updateStrings();
  }

  updateStrings() {
    this.fretsArray = new Array(this.frets).fill(0);

    this.stringObjects = [];
    this.tuning.forEach((s, i) => {
      let startNote = this.tuning[i];
      let startValue =
        this.noteMap.indexOf(startNote.note) +
        startNote.oktave * this.noteMap.length;

      const stringObject: any = { notes: [] };
      this.stringObjects.push(stringObject);
      for (let f = 0; f < this.frets; f++) {
        const fretIndex = startValue + f;
        const oktave = Math.floor(fretIndex / this.noteMap.length);
        const noteIndex = fretIndex % this.noteMap.length;
        const note = this.noteMap[noteIndex];

        stringObject.notes.push({
          note,
          fret: f,
          selected: false,
          oktave,
          isRoot: false,
        });
      }
    });

    this.stringObjects.reverse();
  }

  onTriad(event: any, rootNote: string) {
    this.highlightScale(rootNote, this.scales[event.target.value], [3, 5]);
  }

  onScale(event: any, rootNote: string) {
    this.highlightScale(rootNote, this.scales[event.target.value]);
  }
  highlightScale(rootNote: string, scale: Scale, filter?: number[]) {
    this.clearAllSelected();
    const steps = scale.intervals;
    const startIndex = this.noteMap.indexOf(rootNote);

    const notes = [startIndex];
    let currentNote = startIndex;
    steps.forEach((interval: number, i: number) => {
      currentNote += interval;
      if (!filter || (filter && filter.includes(i))) {
        notes.push(currentNote % 12);
      }
    });

    this.stringObjects.forEach((s) => {
      s.notes.forEach((note: any) => {
        note.selected = false;
        const noteIndex = this.noteMap.indexOf(note.note);
        if (notes.includes(noteIndex)) {
          note.selected = true;
          note.isRoot = note.note === rootNote;
        } else {
          note.hide = !this.showNotesNotInScale;
        }
      });
    });
  }

  clearAllSelected() {
    this.stringObjects.forEach((s) => {
      s.notes.forEach((note: any) => {
        note.selected = false;
        note.hide = false;
        note.isRoot = false;
      });
    });
  }

  updateFretsNum(value: string) {
    this.frets = parseInt(value, 10);
    console.log(this.frets);
    this.updateStrings();
  }

  setStep(step: any) {
    this.stringObjects.forEach((s, stringNum: number) => {
      s.notes.forEach((note: any, noteNum: number) => {
        note.selected = false;
      });
    });

    step.notes.forEach((recordedNote: any)=>{
      const note = this.stringObjects[recordedNote.stringNum].notes[recordedNote.noteNum];
      note.selected = true;
      this.playNote(note)
    });
  }

  addStep() {
    const notes: any = [];
    this.stringObjects.forEach((s, stringNum: number) => {
      s.notes.forEach((note: any, noteNum: number) => {
        if (note.selected) {
          notes.push({
            stringNum,
            noteNum
          });
        }
      });
    });
    this.steps.push({
      notes,
      active: false
    });
  }

  playSteps() {
    let count = 0;
    let id = setInterval(()=>{
      this.setStep(this.steps[count]);
      count ++;
      if (count >= this.steps.length) {
        clearInterval(id);
      }
    }, 2000);
  }
}
