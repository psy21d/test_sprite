<template>
  <div class="hello">
    
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as PIXI from 'pixi.js'

import { hashes } from '@/mock/images/imgHash'
import { imageExtractor } from '@/common/functions/ex'


@Component
export default class HelloWorld extends Vue {
 
  app:any = null
  
  mounted() {
    this.app = new PIXI.Application();
    document.body.appendChild(this.app.view);

    var textures = [];
    
    hashes.forEach(element => {

      textures.push(PIXI.Texture.from(`https://rixtrema.net/${imageExtractor(element,45)}`));

      // this.app.loader.add(element, `http://localhost:666/${imageExtractor(element)}`).load((loader:any, resources:any) => {
      //   // This creates a texture from a 'bunny.png' image
      //   const loaded = new PIXI.Sprite(resources?.element?.texture);

      //   // Setup the position of the bunny
      //   loaded.x = this.app.renderer.width / 2;
      //   loaded.y = this.app.renderer.height / 2;

      //   // Rotate around the center
      //   loaded.anchor.x = 0.5;
      //   loaded.anchor.y = 0.5;

      //   // Add the bunny to the scene we are building
      //   this.app.stage.addChild(loaded);

      //   // Listen for frame updates
      //   this.app.ticker.add(() => {
      //       // each frame we spin the bunny around a bit
      //       loaded.rotation += 0.01;
      //   });
      // });
    })
  }    

  destroyed() {
    delete this.app.view
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
