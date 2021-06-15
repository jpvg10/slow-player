import { Text, Window, hot, View, Button, Slider, useEventHandler } from '@nodegui/react-nodegui';
import {
  AcceptMode,
  FileMode,
  Orientation,
  QPushButtonSignals,
  QFileDialog,
  QSliderSignals
} from '@nodegui/nodegui';
import React, { useState } from 'react';
import { Sample } from './components/sample';
import { createPlayer, EEventTypes, IPlayer, secondsToTimestamp } from 'slow-player-core';

const minSize = { width: 500, height: 520 };

const App = () => {
  const [time, setTime] = useState(0);
  const [filePath, setFilePath] = useState('');
  const [speed, setSpeed] = useState(100);
  const [finalTime, setFinalTime] = useState(100);
  let player: IPlayer | null;

  const initializePlayer = async (filePath: string) => {
    console.log(filePath);
    try {
      player = await createPlayer(filePath);
      console.log('Song length:', secondsToTimestamp(player.songLength));
      setFinalTime(player.songLength);

      player.events.on(EEventTypes.TIME, (t: number) => {
        console.log(secondsToTimestamp(t));
        setTime(t);
      });

      player.events.on(EEventTypes.SONG_END, () => {
        console.log('Song ended');
      });
    } catch (e) {
      console.log(e);
    }
  };

  const openHandler = useEventHandler<QPushButtonSignals>(
    {
      clicked: async () => {
        console.log('Open');
        const fileDialog = new QFileDialog();
        fileDialog.setFileMode(FileMode.ExistingFile);
        fileDialog.setAcceptMode(AcceptMode.AcceptOpen);
        fileDialog.setNameFilter('Music (*.mp3)');
        fileDialog.exec();

        const selectedFiles = fileDialog.selectedFiles();
        console.log(selectedFiles);
        setFilePath(selectedFiles[0]);
        initializePlayer(`"${selectedFiles[0]}"`);
      }
    },
    []
  );

  const playHandler = useEventHandler<QPushButtonSignals>(
    {
      clicked: () => {
        if (player) player.play(speed / 100, secondsToTimestamp(time));
      }
    },
    [speed, time]
  );

  const pauseHandler = useEventHandler<QPushButtonSignals>(
    {
      clicked: () => {
        if (player) player.pause();
      }
    },
    []
  );

  const sliderHandler = useEventHandler<QSliderSignals>(
    {
      valueChanged: (value) => {
        console.log('slider', value);
        setSpeed(value);
      }
    },
    []
  );

  return (
    <Window windowTitle="Slow Player" minSize={minSize} styleSheet={styleSheet} maxSize={minSize}>
      <View style={containerStyle}>
        <Text id="title">Slow Player</Text>
        <Sample />
        <Button text="Open file" on={openHandler}></Button>
        <Text>{filePath}</Text>
        <Button text="Play" on={playHandler}></Button>
        <Button text="Stop" on={pauseHandler}></Button>
        <Slider
          orientation={Orientation.Horizontal}
          value={speed}
          minimum={50}
          maximum={100}
          singleStep={5}
          on={sliderHandler}
        ></Slider>
        <Slider
          orientation={Orientation.Horizontal}
          value={time}
          minimum={0}
          maximum={finalTime}
          singleStep={1}
          enabled={false}
        ></Slider>
      </View>
    </Window>
  );
};

const containerStyle = `
  flex: 1;
`;

const styleSheet = `
  #title {
    font-size: 24px;
    padding-top: 20px;
    qproperty-alignment: 'AlignHCenter';
  }
`;

export default hot(App);
