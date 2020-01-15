// Note: I totally stole this from here.
// I am not some TypeScript god.
// https://stackoverflow.com/questions/43058801/typescript-path-mapping-for-react-native-android-ts-and-ios-ts-modules

// This file exists for two purposes:
// 1. Ensure that both ios and android files present identical types to importers.
// 2. Allow consumers to import the module as if typescript understood react-native suffixes.
import DefaultIos from './SegmentedControl.ios';
import * as ios from './SegmentedControl.ios';
import DefaultAndroid from './SegmentedControl.android';
import * as android from './SegmentedControl.android';

declare var _test: typeof ios;
declare var _test: typeof android;

declare var _testDefault: typeof DefaultIos;
declare var _testDefault: typeof DefaultAndroid;

export * from './SegmentedControl.ios';
export default DefaultIos;