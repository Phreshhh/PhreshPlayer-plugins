## What is ***Skip-Scenes*** functionality?

The media-player will skip unwanted/inappropriate scenes ***(already defined in a `.skip` file)*** during a playback. So, everytime  user does not have to stay attentive for a scene to come then forward/skip the scene manually.

### Reason?
Because other solutions like croping/cutting whole movies/videos are quite time & resource consuming.

## How to create a `.skip` file for a video:

1. Open notepad and define time-span(s) [which you want to skip automatically during a playback]:
* e.g:
* `00:00:07` - `00:00:08`
* `00:01:02` - `00:07:08`
* `00:02:26` - `00:02:26`

3. If there are more than one scenes, define them on new lines, like in the picture below:
<img src="https://github.com/Phreshhh/PhreshPlayer-plugins/tree/master/skipscenes/assets/img/filecreate-example/p1.png" width="700" alt="Playing video">

4. Now save the file with the **same name** as your video file but with a **`.skip`** extension & then save the **`.skip`** file in the **same directory** as your video file:
<img src="https://github.com/Phreshhh/PhreshPlayer-plugins/tree/master/skipscenes/assets/img/filecreate-example/p2.png" width="700" alt="Playing video">
<img src="https://github.com/Phreshhh/PhreshPlayer-plugins/tree/master/skipscenes/assets/img/filecreate-example/p3.png" width="700" alt="Playing video">

6. Now, **drag-n-drop** the video file in Phreshh media player.
<img src="https://github.com/Phreshhh/PhreshPlayer-plugins/tree/master/skipscenes/assets/img/filecreate-example/p5.png" width="700" alt="Playing video">

7. You will see **skip on/off** button at the bottom right corner of the player controls. From there you can turn skipping on or off.
**On means**: The scenes you have defined in the .skip file will be skipped automatically during playback.
**Off means**: The playback will be in normal flow, the scenes will not be skipped.