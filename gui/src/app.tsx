import { Text, Window, hot, View, Button, Slider, useEventHandler } from '@nodegui/react-nodegui';
import { FileMode, Orientation, QPushButtonSignals, QFileDialog } from '@nodegui/nodegui';
import React from 'react';
import { Sample } from './components/sample';

const minSize = { width: 500, height: 520 };
const App = () => {
  const buttonHandler = useEventHandler<QPushButtonSignals>({
    clicked: () => {
      console.log('Open');
      const fileDialog = new QFileDialog();
      fileDialog.setFileMode(FileMode.AnyFile);
      fileDialog.setNameFilter('Music (*.mp3)');
      fileDialog.exec();

      const selectedFiles = fileDialog.selectedFiles();
      console.log(selectedFiles);
    }
  }, []);

  return (
    <Window windowTitle="Slow Player" minSize={minSize} styleSheet={styleSheet} maxSize={minSize}>
      <View style={containerStyle}>
        <Text id="title">Slow Player</Text>
        <Sample />
        <Button text="Open file" on={buttonHandler}></Button>
        <Button text="Play"></Button>
        <Button text="Stop"></Button>
        <Slider orientation={Orientation.Horizontal} value={50} minimum={50} maximum={100} singleStep={5}></Slider>
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
