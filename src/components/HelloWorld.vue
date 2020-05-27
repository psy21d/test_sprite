<template>
  <div class="hello">
    
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as PIXI from 'pixi.js'

type Event = {
  event: string,
  filename: string,
  content: string
}

@Component
export default class HelloWorld extends Vue {
 
  app:any = null
  events: Array<Event> = [];
  
  pixiRender = () => {
    this.app = new PIXI.Application();
    document.body.appendChild(this.app.view);

    this.events.forEach(event => {

      //textures.push(PIXI.Texture.from(element));

      const base = new PIXI.BaseTexture(event.content);
      const texture = new PIXI.Texture(base);
      const sprite = new PIXI.Sprite(texture);

      // this.app.loader.add(element, `http://localhost:666/${imageExtractor(element)}`).load((loader:any, resources:any) => {
      //   // This creates a texture from a 'bunny.png' image
      //   const loaded = new PIXI.Sprite(resources?.element?.texture);

      sprite.x = this.app.renderer.width / 2;
      sprite.y = this.app.renderer.height / 2;
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 0.5;

      this.app.stage.addChild(sprite);

      this.app.ticker.add(() => {
        sprite.rotation += 0.01;
      });
    
    })
  }

  mounted() {
    // TODO вынести в настройки окружения
    let webSocket = new WebSocket('ws://127.0.0.1:666');

    webSocket.onmessage = (content:any) => {
        //console.log(event.data);

        let event = ''

        try {
          var incoming = JSON.parse(content.data)
          event = incoming.event
        } catch(e) {
          console.log(e)
          console.log(content)
        }

          console.log(event)
          
          // make router
          if (event === "file") {
            this.events.push(incoming)
          }

          if (event === "render") {
            console.log(`render ${this.events.length} elements`)
            this.pixiRender()
          }


    }

    webSocket.onopen = () => {
      webSocket.send(JSON.stringify({"event": "send_images"})) 
    };
    
  }

  destroyed() {
    delete this.app.view
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
