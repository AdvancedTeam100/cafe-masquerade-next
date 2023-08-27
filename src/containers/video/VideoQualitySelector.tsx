import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import videojs, { VideoJsPlayer } from 'video.js';
import ConfigMenu from '@/components/video/ConfigMenu';

const vjsComponent = videojs.getComponent('Component');

export type Quality = number | 'auto';

const VideoQualitySelectorComponent: React.FC<{ player: VideoJsPlayer }> = ({
  player,
}) => {
  const [qualities, setQualities] = useState<Quality[]>(['auto']);
  const [currentQuality, setCurrentQuality] = useState<number | 'auto'>('auto');
  useEffect(() => {
    player.on('loadeddata', () => {
      const tech = player.tech();
      if (tech.vhs) {
        const representations = tech.vhs.representations();
        const availableQualities: number[] = [];
        representations.forEach((rep) => {
          availableQualities.push(rep.height);
        });
        availableQualities.sort((a, b) => b - a);
        setQualities([...availableQualities, 'auto']);
      }
    });
  }, [player]);

  const setQuality = (newQuality: Quality) => {
    const tech = player.tech();
    if (tech.vhs) {
      const representations = tech.vhs.representations();
      representations.forEach((rep) => {
        rep.enabled(rep.height === newQuality || newQuality === 'auto');
      });
    }
    setCurrentQuality(newQuality);
  };

  return (
    <div className="video-quality-selector">
      <ConfigMenu
        currentPlaybackRate={1}
        qualities={qualities}
        currentQuality={currentQuality}
        setQuality={setQuality}
      />
    </div>
  );
};

//class base component need to change into functional component
class VideoQualitySelector extends vjsComponent {
  constructor(player: VideoJsPlayer, options: videojs.ComponentOptions) {
    super(player, options);
    this.mount = this.mount.bind(this);

    player.ready(() => {
      this.mount();
    });

    this.on('dispose', () => {
      ReactDOM.unmountComponentAtNode(this.el());
    });
  }

  mount() {
    ReactDOM.render(
      <VideoQualitySelectorComponent player={this.player()} />,
      this.el(),
    );
  }
}

export default VideoQualitySelector;
