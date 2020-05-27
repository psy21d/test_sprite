<template>
 <div class="container">
  <div class="hello">
    <div class="header">
      Фото
    </div>
    <div class="year">
      <div class="year--number">
        2010—2020
      </div>
      <div class="year--town">
        Санкт-Петербург
      </div>
    </div>
    <div class="viewer" ref="viewer">
    </div>

    <div class="year">
      <div class="year--number">
        2020—2030
      </div>
      <div class="year--town">
        Москва
      </div>
    </div>
    <div class="viewer2" ref="viewer2">
    </div>

  </div>
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

@Component({
  data() {
    return {
      app: new PIXI.Application({
        transparent:true,
        width:360,
        height:300
      }),

      app2: new PIXI.Application({
        transparent:true,
        width:360,
        height:300
      })
      
    }
  }
})
export default class HelloWorld extends Vue {
 
  app:any = null
  app2:any = null
  
  events: Array<Event> = [];

  pixiRender() {

    // TODO remove viewer properly

    this.events.forEach((event,n) => {

      const base = new PIXI.BaseTexture(event.content);
      const texture = new PIXI.Texture(base);
      const sprite = new PIXI.Sprite(texture);
      const sprite2 = new PIXI.Sprite(texture);
      
      let x = (this.app.renderer.width/32) * ( n % 32)
      let y = Math.floor(n / 32) * 10

      sprite.x = x;
      sprite.y = y;
      sprite.width = 11.2;
      sprite.height = 10;
      sprite.anchor.x = 0;
      sprite.anchor.y = 0;

      sprite2.x = x;
      sprite2.y = y;
      sprite2.width = 11.2;
      sprite2.height = 10;
      sprite2.anchor.x = 0;
      sprite2.anchor.y = 0;


      this.app.stage.addChild(sprite);
      
      this.app2.stage.addChild(sprite2);
    
      // this.app.ticker.add(() => {
      //   sprite.rotation += 0.01;
      // });
    
    })
  }

  mounted() {
    // TODO вынести в настройки окружения
    let webSocket = new WebSocket('ws://192.168.0.145:666');

    (this.$refs.viewer2 as HTMLElement).appendChild(this.app2.view);
    (this.$refs.viewer as HTMLElement).appendChild(this.app.view);
    
    

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

}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}
.hello {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.header{
  margin-top: 40px;
  margin-bottom: 20px;
  padding-left: 20px;
  font-size: 40px;
  font-weight: bold;
}
.year--number {
  margin-top:20px;
  padding-left: 20px;
  margin-bottom:10px;
  font-size: 30px;
  font-weight: bold;
}
.year--town {
  padding-left: 20px;
  margin-bottom:10px;
  font-weight: 100;
  font-size: 20px;
  color: #cccccc;
}

</style>
