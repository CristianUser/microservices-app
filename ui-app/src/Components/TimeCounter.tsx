import { Statistic } from 'antd';
import React, { FC, useEffect } from 'react';

type TimeCounterProps = {
  title?: string;
  startTime: any;
  endTime?: any;
};

function convertHMS(sec: number): string {
  let hours: string | number = Math.floor(sec / 3600); // get hours
  let minutes: string | number = Math.floor((sec - hours * 3600) / 60); // get minutes
  let seconds: string | number = Math.floor(sec - hours * 3600 - minutes * 60); //  get seconds
  // add 0 if value < 10; Example: 2 => 02
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
}

const TimeCounter: FC<TimeCounterProps> = (props: TimeCounterProps) => {
  const { title, startTime, endTime } = props;
  const [, updateState] = React.useState<any>();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const scDiff =
    ((endTime ? new Date(endTime).getTime() : new Date().getTime()) -
      new Date(startTime).getTime()) /
    1000;
  let updateInterval: any;
  useEffect(() => {
    if (!endTime) {
      updateInterval = setInterval(() => forceUpdate(), 1000);
    }
    return () => clearInterval(updateInterval);
  }, []);

  useEffect(() => {
    if (endTime) {
      clearInterval(updateInterval);
    }
  }, [endTime]);

  return startTime ? <Statistic title={title} value={convertHMS(scDiff)} /> : null;
};

TimeCounter.defaultProps = {
  title: '',
  endTime: undefined
};

export default TimeCounter;
