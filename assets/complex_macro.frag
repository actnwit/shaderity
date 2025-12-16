#define VERSION 2
#ifndef VERSION
    #define VERSION 0
#endif
#if VERSION > 1
    // バージョン1より新しい
#endif
#define DEBUG
#define RELEASE
#if defined(DEBUG) && !defined(RELEASE)
    // デバッグビルド
#else
    // リリースビルド
#endif
#define LINUX
#if defined(WINDOWS) || defined(LINUX)
    // Windows または Linux
#endif
#ifndef MACOS
    // MACOSではない
#endif
#define FEATURE_A
#define BETA
#if defined(FEATURE_A) && (VERSION > 2 || defined(BETA))
    // 複雑な条件による分岐
#endif
#if(VERSION==2)
    // 空白なしのif文
#endif
#ifVERSION==2 // プラグマとして認識しない
