webpackJsonp([9],{"1UjO":function(t,e,i){var a=i("vHsw");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);i("rjj0")("6523466b",a,!0)},"3Anw":function(t,e,i){e=t.exports=i("FZ+f")(!1),e.push([t.i,".toast[data-v-7b25e366]{position:absolute;left:640px;-webkit-transform:translate(-50%,-50%) scale(1);transform:translate(-50%,-50%) scale(1);word-wrap:break-word;padding:10px;text-align:center;z-index:9999;font-size:22px;max-width:80%;color:#fff;border-radius:5px;background:rgba(0,0,0,.7);overflow:hidden}.toast.middle[data-v-7b25e366]{top:50%}.toast.top[data-v-7b25e366]{top:10%}.toast.bottom[data-v-7b25e366]{top:90%}.fade-enter-active[data-v-7b25e366],.fade-leave-active[data-v-7b25e366]{-webkit-transition:-webkit-transform .5s;transition:-webkit-transform .5s;transition:transform .5s;transition:transform .5s,-webkit-transform .5s}.fade-enter[data-v-7b25e366],.fade-leave-active[data-v-7b25e366]{-webkit-transform:translate(-50%,-50%) scale(0);transform:translate(-50%,-50%) scale(0)}",""])},"7zXY":function(t,e,i){"use strict";var a=i("7+uW"),s=i("VOx/"),r=a.a.extend(s.a),n=function(t){t.target.parentNode.removeChild(t.target)};r.prototype.close=function(){this.visible=!1,this.$el.addEventListener("transitionend",n)};var o=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=document.createElement("div");e.className="Toast";var i=(new r).$mount(e),s=t.duration||2500;return i.message="string"==typeof t?t:t.message,i.position=t.position||"middle",document.body.appendChild(i.$el),i.visible=!0,a.a.nextTick(function(){i.timer=setTimeout(function(){i.close()},s)}),i};e.a=o},"8TmN":function(t,e,i){"use strict";function a(t){i("1UjO")}Object.defineProperty(e,"__esModule",{value:!0});var s=i("kCHK"),r=i("iBYA"),n=i("VU/8"),o=a,c=n(s.a,r.a,!1,o,"data-v-3e050d8a",null);e.default=c.exports},"F+Ov":function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAABQCAYAAABCiMhGAAAAAXNSR0IArs4c6QAABLZJREFUeAHtnMtqFEEUhnt6bokzigZvmI14wSwkxIWi4BNkFd8iqyxCHiDPkNcIakBIELIMujHigIig4EbBa4ZAvEyYSfz/mpzmTKemM5e4kDoFM6er6pwzVR9/V3UgXbmox7KxsXGyWCzexGe8VCpVcrncaBzHBXyifD4f0bJIXa7F+nwkhn3ip9vk2nX2+NVqtX4i369ms/mjUCi8wji/9xgaFY5yXF9fvwCfW/v7+1dhcxwgfiCZfLd4mYhYn9/e3l6SJ8vPF9utDSAq6KsAxDnYCYz7EyyhfOgWI+1dYSwuLhYmJydv7+7uTpXL5XwvACQprUxUrO6Taw0gy0/8B7TjiBsHlLewzzGPn93yeGGsrq6Wd3Z2ZkD5XHrA3RKl2yVObLqfdQ0gy88XO0DbBGIuA8pDAKn74ts3uupZWloqb21tzaCJMnMDlu5+BsyJpuMlj1idT/yl7x/ZEeR9ACBnfPk7YBBEtVqdAblEEYMOWOLE+n5cA8jy88UO0XYCsV4gHTCwS1BKHYoYdMASJ9Y3eA0gy88XO2QbgdxJ50hgQBWnoIi7epuj86ADljix6R9mXQPI8vPFHkPbddwuV3SeBAZA3ENHEfu065eBimVjPwOWOLEuaepL58vyS4UdZ/UegOQkoYOBbfQ0Gvgc4R6gaGWgYtnWz4AlTizj00Xny/JLxx1jnQvpNcnnYFQqlSkQcteBKYMcpjpg4BZJ6AS0ZgiDCxDCWVZi3CJnIVHuv64EqAzO+yK/4pGRET6uJiVAZXDubRhQwqWEBC4CVYYTRIz7paphBKoMPoRFMSZf0jACVUYeoihxO+Xf/0kJVBmcf4UwTBltKThltC8PvgNWRuSeOjWNQNcMh+AQDFOGkoYpQ8EwZSgYpgwFw5ShYJgyFAxThoJhylAwTBkKhilDwTBlKBimDAXDlKFgmDIUDFOGgmHKUDBMGQqGKUPBMGUoGKYMBcOUoWCYMhQMU4aCYcpQMEwZCoYpQ8EwZSgYpgwFw5ShYJgyFAxThoJhylAwTBkKhilDwTBlKBimDAXDlKFgmDIUDFOGghG0MvAP5O039A6ABKyMXf5T7C8ljFDfNyGCRow3CDtgBKoMvqv+B6+nxb9NGdFvvLS4R2V81TACVcYXMuCawcM2khLobuIYxLVa7TPU8UdoBKqMNozl5eUWttf3AiNAZdSxXrhzedz7Jqi8FhgBKqMmc3cwFhYWvuNWcYtIYMrg8vC2AwYrgPGMNjBlvMBd0eS8WZwyeDE/P/8Ja8dmQMr4CBCvOHcpCQw2zM7OPocyPvNazrMQyzaoh6anInFifUE6X5afL3bINh5P9TSdowMGO7e3t59AId9koGLZ18+AJU4s49NF58vyS8cNWeefHytQRceTN3MegjE3N9cYGxtbQd8353BwTB2v+xmwTFQs49NF58vyS8cNUSeIxwDR2zld/KHp6elGvV5/hPXjzaADljixvgloAFl+vtgB2vhgtdwNBPMlh+90S762tnYZhxvexzkbp2EjHG0X0cpEaLkDZdWZ2+fDdl982p/1IUoDsZuA8PKoHEfCkAQ88HB0dPQGPuf/g1MfuR5s4fMOEI484FDmaFYR+AvPHT3mH+JCiAAAAABJRU5ErkJggg=="},PesU:function(t,e,i){t.exports=i.p+"static/img/componentBig.1807903.png"},"VOx/":function(t,e,i){"use strict";function a(t){i("WjK3")}var s=i("lBCx"),r=i("tCcl"),n=i("VU/8"),o=a,c=n(s.a,r.a,!1,o,"data-v-7b25e366",null);e.a=c.exports},WjK3:function(t,e,i){var a=i("3Anw");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);i("rjj0")("6a9935e9",a,!0)},Yyi7:function(t,e,i){t.exports=i.p+"static/img/componentqueding.44cc523.png"},i0RR:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ8AAAA9CAYAAACzz7sFAAAAAXNSR0IArs4c6QAAD8BJREFUeAHtXQuQFMUZ7p7ZvTv2VDjudmcPRZBnDPioaJFEk6IiqNGoIVQECpV7oCYxljGWKWNhImqsMpVQ0WBK0ehxCFUIRkwMRksRMIWPWMGKitGoHMgBO7v3Au/2XjvT+f6522V3tve9d8DddNVud//99z/d/3zT7wdnQ2RCT1VNMFXlRlMo9ZyzSakeIxjr5ky8wDh7VjtT38q/wyKpeB36yNIAL3Z2Auu0cmayFYLxn0N4WS7yhWBtAOLjWp++kv+I9ecS1+E9+TRQVPABeGcJk2+F0LMLVMUOXmIu0ZYG9QLlpIwutjNXS3OV1zQVrxDcywTzgtkrOK+C7YHfA7uc3JwLuDncZA+GcSt8kIeroBfRiC58vO34ENtgdyAtqCCQAhCQhg44g0izzhQWVIR5GP6AUPghrUw/yBexPuI9GUzRwHe08dTKsOnZAw1pxcm4CLrN/gsr69sO5CIPpSdvebqqWrj5FCbUqXhbk03BKE0+vDqfZXPmQ8YrcpF7svAivy3AaDPyegAfzRdI9x58YDur6wMfnWh5KBr4Ag3aNgDvkuJmUOzy1+rfsssUm5ga7NQmMUVMQ5tyGpQ8DTwzgDsAjk1BCVFqjzPa/fgow9DBPujqfejoddU0tnqXtxw6nnopCvgON/hr8cIbhiIj+JLvx5f8BaqZmbBnoFokG2DjrqF43uiRKQzo9BWuiC2KYu7w3RD6bLjzXjD4qBTSwxqqRl4tT7zYzoX4o1YXfEEWHmqsmmEI9ZeIXycLd2jDpQFB4NvoEpENVXWtHw/HUwsGX2CtNg/AeU2eWLFeq9GXDTSU5RxRqr7Wd51gyvqo37GPpwbEv1AqNpaW924Yv6j9yFClpGDwocpdBXDdkZRAIfZqTJ+F8qwnKSwF4fBa/2Yk6IcpgotKRnXeihK5GeOLLRDcg/ZiN9pCNObYA1o3h5txEabeJmgdeBntCjM7MHbZ7lb6O4wStcO3KNRZjETR8BRKnHER7qrgphiLdqxbJhftNRVpq0I6NevHmB/pOx3pm2DZnI2XxcuXBh1Rz/lFPHetNkb/B3rSRr6yZPEKBh9KvudR8v0gSTgXN/lr9D8n0dMQAo3aVUzwF9OwZBckBH2tX+BFUVtxP17OAbRtmtHra1ZdRrO3MnSAX8l6sxN28nAdWjPB4/b0TTQNZRLeyWR0Mr4KHcyHe1ahuQAQm6HH32ke/UmAsLtQeRS/cPA1aLvQy73InhjOzYu0muBbdno6f+iZqpmG4cqivSE68eU3QdZe5IDsJth7Mbi9n6lsr3+Z3pXuOaMtjEpWNWLMNLkyBx22K5B/jErwU/LRA0BIQzkPl3j6Hi20Si4YfKh2d6DanWvPCBK5uLo2sMlOT+cPPV31NUNx/TuRRxyE/z1UK7sxoPqeW+3fPX5ZO41fOSZPDVAnMRT2XoyO3nx8tFcCBBfkLEqILxFnNYZsHsKQDblzNlmDr2PD2Ir+XvdZ+HJMJPqgvy7QQh0JjO9tQMm31P5kgO8xgO8WOz2dn4ZsEF6P39toX70N8W/66kKBdHGcsMI1QDWOGVHrBGc1KBH9uUjEe25BLXSvvzywJtc2YVrwtTRUfqWfu3+GxFwFxjPiE2XNw3KxBQ8+BeBbHB824BYGpn/ORxX4YXKYQzkRNSBWMiU42Tcftcwy/BbinY/JNp0A4X/B+wsUOFuzjSMF3+DigAcg5DZ8CWq2wpL5RBAl5ZLqmsD25DCHciJrAKuSTjVUdREKl3pZmz512kWDNkm/OZvVSUngO9zon4MH/sVe0qV+WDYhYhuGEm4drsHLbFLk8GSvgeAz3mlGRP0J2oe3AhclGWMK8aZHCV9zWs2Xrel4E8A3ONvwDkq7cekiZR+Gypmxl1D6rXJKv+y1dqJytq2rOLPXKL0f437LgJEE7NjTjDd/gKviynTNrpgAa5qsS/sfZE6xC8rPL3ZhedXNJ+Jqivzy48SKagDNstkYbn4EWMGQTRqDHjF3iW9rNwT/I+OKgU9v8N0huLJKxjRAEwEM2H4C1J8N1NPSJKkB4sPopa7QavVHqDcsZXKII0IDGOlYiqoYmEndQwYAqOqdi47IHnumLfAFN3lPMcMKFiXKBh6FgWmo+3zlwd9HR7b1Z3zngfog+L+XIBAzC6owLvHWt+xOoDueEasBwo4Iq6sBstrUmRRBbrJvavX63ngeC3zoZNyFucyH4gNibi6WYJrs2Zg/zoGpteXwPgkQooxzgBenmlHn1Bv996LWW5k64+JDTM2dHz8WqBAzgPdjaSQh1qQCHvFjoedTqIrvJzfWhN3olHikidFptJrAfSiAluNnyjXAZwfDvtvjwxS90XcuCJPjiZYbQlxKhMb60poy1vMwEP+Sryb0XFpGJ3DEa8Bfpz+NkY0bU2XUZMoDrevHxyYrFJRc82TMGOF+taqmleZV05qKuo4OvxZYmJbJCRw1GkDHogF9hN/KMow23pi+/pLfRMMUgGxG1GOzt9n8Kb0jcXlSysw6ARk14KvV70b1+6qMEZ2DhRjWG0NhCjwTpUxcfCKjOzRHA5k0YHU/GV8h5eP81ECX/yoKo5JvgoxJZUbGKlcWz6E5GiANVNcF3sXwyxsptLGE6NTbrZQxKC5Tl9EdmqOBHDTwJxkvattziK6gcVghY6A9CjK6Q3M0kK0GVNVINdkwmWQomB6xGn92gcXaHGOX6/hHjwZoLzCG4ZL3ynDupsXJCmZfrYFmu0oQyZr9sNMdv6OBHDWwT8Yf6XNpCgYFaXtcstnM3MlEh+JoIDcNYCHKWFkM7hadNNRyVBb4ZeTU02R0h+ZoIFsN0GpoTN5K94SML2lrpWqX9rgmmb7eEjoqzDGOBvLWgOFS50ojC/EprZCialc6pII9ninX7EkFOkRHAzYNYDHxrTaS5QXmrP3cVO0ekDFge+QUGd2hORrIRgOhdf65mOm4XMaLbbF/IzoNteyXMaCheJ6M7tAcDWTSAJ36ahhitYwPsx7dPk/wJQqjQWbabykxfEG2wy3tG6onSQQ4pFGqgcB+/6+wvtiaxbCrAHh7IroiXsFZvi/bGQb9k/VG7eoUYTEyTpaa1dtnPhsjOI5RrQEc9rQYALtHrgTRUVbSc180TMHWtiCWv3wQJdjsVbRG30aLeal4xYP+AJR/HRuQbogFOI5RqQEsTL4eoyd0fIp04gJYuXvcdUfao8qxmFD6PRElJNp8mhFWt7Y3jEvax9u2qWKsvl/bjAddSnHQO36CDvpJjO/4RoMG6JgN7OdZgYXJ6zCup8ryjCbcu77a4Jr4MGsKjRb3YY1VM3on4+MDo240Elvg3oxOyE6gN4KHzERHBWe4JG6hJD7sXrsIh/t8Go3r2CNbA9jDexaOptsILMxJlVMAL1Qi+i6w3ywQm7/FsbQ4HEZpTCUge7roBEjvxNl8CSjPPr7DebJoAE2thVgCsBa1H2YyUhnRheG8y7Xa4C47Rwx8FICicwsQvMDOlJ9fbMcGpJ9WLWtN0ZvOT6oT6/hrgE4vwxG+jwIr0v0/x1IoOhRuXoLNZe8dox1zJYBPNLAynWs70xWhx6Jm4RrYRvektl+/ha9E4eyYk1oDtPOsL1KyAiXZTcCItG0Xl8F9impcmu6KhQTwUUQ6Hg2nEaxD+29hnKA8neJzTLFc45zXkqf6ToBoVmdisv8K9GLrAboFqXqyiUkV28rcPdfG92wTwwd8SeCLMuEcjiXoVNwFhJ8fpSXZKNlQ57cCqN6kMCY60TE5B2v59yWHOZQTXQPWiVRm6XKkE6BLPBg0ddrRtWDsIW2ffk82NV1K8EUfgI7IVIBwPoA0G0Cbit5uHzoUzRha+bjc3bUx3Ouh04pkx+Kuwh7OO6NysrFpdSvmlMsrr29rzobf4SmuBmgJVER1DZRyXFyGgicjPqIpAOw+wpnZN2n1wTejtEy2KxMDeimfg4d+UnO4oXyiLIUA6U5phDREOvOZDgRHx+co2D7CDxcJsg/oIHDc8bjbWdqfRnl5BOEs5mqjXz0b47xzUaVeajA2B++S7vqAkb1VyUNwRg/i3+P3BB6LP4dFwplEygi+pBg2AkpBDFQnJxTga7WxZvRCVniAidNC1m9YPxTkJvTBwoIOH/8MNNqU8j5+e0Fugt1kzdLA4Zj0GqCJgd6u0ssAtO+iFrvaMNBcir295HeYXpqIoB342Bije+XYuqNt6XnloQWDDwmgW3ySDFeV6SBmXQSTgH7mPkcialA2qgDOSCb9FlvEwf4zSsou+JugULqohAbErR/A3ALkhnBCZhDnhBzUuvXm0XCJNKpA3rK+yo+m0lQ0Yy7GrUbzsIZuZl9YTLS0CEWm1rOl2TR/Vrvur9DznbhPL2WNmEZALKhg8CERe5DXmMCowxSiBu7GqD+TbfWqrA5OJk5ZOF3EzGYjFbPjS2Eo3/JGz03SSzURWMtCoGM2RzSTjXEoHddNDVx7pdC1V8K6Bgtg7YHMsKoYRwxTbceBSB3jajuO4OVRo3rYDJ0YG+j0j3e7+qtws1CVwVRriAPpVFDyU0fPD7d1/RXycwbydYa+lp2J5pqbEmm9mQHERX1EztkAclS6bcQpA6vs5+zlLGwwgpW2fCNTPDrlCnqQHnuKs9duxxFrj2QjH6UX+Pht2fAeNx4at+SM2qPt+ODoBnByF8N4gOlxKJ0qyIYeCi4UipEofGVUkzwPUG/BPRv/zLVNlykNBYOPHgDgAHz8XPnDxEa0Kx5MdTA03beGzN2ChFwhj+9Qh1cDgu5NeQE3C20Z6vMWiwI+zPEtwHnOmJorvsHXR9NzXiTU2dBUfPVComhCCf4aquudqL63DeeNT0UBH+kEpd/fUfolntFcuLJ2aPsC8zim5mhZVw8rm45qYDqqvBlQ1lSIH/wlrq4p/LEjVwLabiHo8HU0A193K30vH8977IoHPpqWM/kOCLywKK9OCB0XiczKdJEIPYumBBXDnG5w9XR4ffiCNbTNfOTGV10NuzLmzzwnCfaRYEQXPtIDANrHyM0b0MNbvFQ0aUuD0t2KxyPHRQMfJR4Tz6f1R9yvoASkMbr8jRDvuEX/tfb1X/kLPBbTusDQdPswf62hgV+J+329qNq9eDnUc/QCpBrscvjL4fbATT/qTeOXcTIdbENrkNZ2PCGE9OlIXxA7wQIAGV2OeBiD8QdpSAlL1ZszzasObSqzk15U8NEjaWGq3q39Gp2I2yG8LLtkDHBZVYIiHtSa9NVU1eYSdzh4xRrm7igZVx4xXR5Rwj0o6a2fqvLSiAEoFMG4VMDKjHQaitpWavS2H4/hnSJkIysRRVGY7EmYJ5yAK+G/jy9xHqrBGXg1E1FyJCzHB9jCaLtRNXAIKn9OY/rjvI7R+JpjHA04GnA0MHQa+D9U6Kx8AhgwvwAAAABJRU5ErkJggg=="},iBYA:function(t,e,i){"use strict";var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"DailyDuration"},[i("div",{staticClass:"topBack"},[i("div",{class:{"back-hover":0==t.isChange}}),t._v("\n    返回\n  ")]),t._v(" "),i("div",{staticClass:"tag"},[t._v("\n    设置每日观看时长\n  ")]),t._v(" "),i("p",{staticClass:"Tip"},[t._v("点击遥控器OK键或者确认键打开时间设置，上下选择时间节点，最后保存即可。")]),t._v(" "),i("div",{staticClass:"setTime"},[i("div",{staticClass:"hour",class:{hourhover:1==t.isChange}},[i("ul",{staticClass:"cul"},t._l(t.hourList,function(e,a){return i("li",{key:a,class:{opacity:t.currHour!=a},attrs:{id:"jv"}},[t._v(t._s(e))])}))]),t._v(" "),i("div",{staticClass:"hour-text"},[t._v("小时")]),t._v(" "),i("div",{staticClass:"minute",class:{hourhover:2==t.isChange}},[i("ul",{staticClass:"minute-cul"},t._l(t.minuteList,function(e,a){return i("li",{key:a,class:{opacity:t.currMinute!=a}},[t._v(t._s(e))])}))]),t._v(" "),i("div",{staticClass:"hour-text"},[t._v("分钟")])]),t._v(" "),i("div",{class:{determineBtn:!0,"hover-btn":3==t.isChange}},[t._v("\n    确定\n  ")]),t._v(" "),t.isShowMsg?i("div",{staticClass:"successMsg"},[t._v("恭喜您时间设置成功")]):t._e(),t._v(" "),i("keyDo",{ref:"keyDo",on:{listenKeyCode:t.keyCode}})],1)},s=[],r={render:a,staticRenderFns:s};e.a=r},kCHK:function(t,e,i){"use strict";var a=i("mvHQ"),s=i.n(a),r=i("OK1g"),n=i("xG35"),o=i("7zXY"),c=i("g5qz");e.a={data:function(){return{isChange:1,currentBtn:0,hourList:[0,1,2,3,4,5,6,7,8,9,10,11,12],minuteList:["00",10,20,30,40,50],currHour:0,currMinute:0,isShowMsg:!1}},created:function(){},mounted:function(){this.init()},methods:{keyCode:function(t){if("down"==t)this.down();else if("up"==t)this.up();else if("left"==t)this.left();else if("right"==t)this.right();else if("KeyEnter"==t){if(0==this.isChange)this.back();else if(1==this.isChange||2==this.isChange){if(this.currentBtn==this.isChange)return void(this.currentBtn=0);this.currentBtn=this.isChange}else if(3==this.isChange){var e=this,i=60*e.hourList[e.currHour]+Number(e.minuteList[e.currMinute]),a="",u="";if(JSON.parse(localStorage.getItem("parentsSetting"))&&(u=JSON.parse(localStorage.getItem("parentsSetting"))),localStorage.getItem("TotalUserTime")&&(a=JSON.parse(localStorage.getItem("TotalUserTime")/1e3/60)),console.log("打印总时常"+a),a&&Number(i)<=Number(a))return Object(o.a)({message:"设置时长不可小于当前时长"}),void localStorage.setItem("parentsSetting",s()(u));var l={siteId:n.a.siteId,userId:n.a.userId,setType:2,childDuration:i};r.a.post(r.a.parentsSetting(),l,function(t){if(200==t.code){e.$store.commit("GET_USERTIMESTASTUS",!1);var a=(JSON.parse(localStorage.getItem("parentsSetting")),{});a.childDuration=i,a.childPwd="",localStorage.setItem("parentsSetting",s()(a)),e.isShowMsg=!0,c.a.setBiLocalCache(107,"107-3","1101","107-1",""),c.a.biPost(),window.setTimeout(function(){c.a.routerSkip("","17",{},e.$router)},500)}})}}else"KeyBack"==t&&this.back()},up:function(){if(1!=this.currentBtn&&2!=this.currentBtn)0!=this.isChange&&(3==this.isChange?this.isChange=2:this.isChange=0);else if(1==this.isChange){if(this.currHour+1>=this.hourList.length)return;this.currHour++,$(".cul").css({transition:"all 0.3s",transform:"translateY(-"+46*this.currHour+"px)"}),12==this.currHour&&(this.currMinute=0,$(".minute-cul").css({transition:"all 0.3s",transform:"translateY(0px)"}))}else if(2==this.isChange){if(this.currMinute+1>=this.minuteList.length||12==this.currHour)return;this.currMinute++,$(".minute-cul").css({transition:"all 0.3s",transform:"translateY(-"+46*this.currMinute+"px)"})}},down:function(){if(1!=this.currentBtn&&2!=this.currentBtn)3!=this.isChange&&(0==this.isChange?this.isChange++:this.isChange=3);else if(1==this.isChange){if(this.currHour<=0)return;this.currHour--,$(".cul").css({transition:"all 0.3s",transform:"translateY(-"+46*this.currHour+"px)"})}else if(2==this.isChange){if(this.currMinute<=0)return;if(10*this.currMinute<=10&&"00"==this.currHour)return;this.currMinute--,$(".minute-cul").css({transition:"all 0.3s",transform:"translateY(-"+46*this.currMinute+"px)"})}},left:function(){1!=this.isChange&&0!=this.isChange&&(this.isChange--,this.currentBtn=0)},right:function(){this.isChange>=2||(this.isChange++,this.currentBtn=0)},back:function(){c.a.routerSkip("","17",{},this.$router)},init:function(){var t=JSON.parse(localStorage.getItem("parentsSetting")).childDuration;Number(t)&&(this.currHour=Math.floor(t/60),this.currMinute=this.minuteList.indexOf(t%60),-1==this.currMinute&&(this.currMinute=0),$(".minute-cul").css({transition:"all 0.3s",transform:"translateY(-"+46*this.currMinute+"px)"}),$(".cul").css({transition:"all 0.3s",transform:"translateY(-"+46*this.currHour+"px)"}))}}}},lBCx:function(t,e,i){"use strict";e.a={data:function(){return{visible:!1,message:"",position:""}},created:function(){console.log("创建toast")}}},rzRZ:function(t,e){t.exports="data:image/png;base64,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"},tCcl:function(t,e,i){"use strict";var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("transition",{attrs:{name:"fade"}},[t.visible?i("div",{staticClass:"toast",class:t.position},[i("i",[t._v(t._s(t.message))])]):t._e()])},s=[],r={render:a,staticRenderFns:s};e.a=r},vHsw:function(t,e,i){e=t.exports=i("FZ+f")(!1),e.push([t.i,".DailyDuration[data-v-3e050d8a]{width:1280px;height:720px;position:absolute;top:0;left:0;z-index:9999;background:#20265f url("+i("PesU")+") no-repeat;background-position:20% -220%;color:#20265f}.determineBtn[data-v-3e050d8a]{font-size:27px;color:#fff;width:148px;height:58px;text-align:center;line-height:56px;border-radius:15px;margin-left:745.3px;margin-top:67.25px;background:url("+i("Yyi7")+") 51% 28%}.back-hover[data-v-3e050d8a]{width:159px;height:61px;position:absolute;top:-6px;left:-6px;z-index:99;background:url("+i("i0RR")+") no-repeat;background-size:100%;background-position:100% 100%}.hourhover[data-v-3e050d8a]{margin:-4px}.hourhover[data-v-3e050d8a],.hover-btn[data-v-3e050d8a]{border:4px solid #4dcfff;border-radius:20px;-webkit-box-shadow:0 10px 20px rgba(0,0,0,.55);box-shadow:0 10px 20px rgba(0,0,0,.55);z-index:999}.hover-btn[data-v-3e050d8a]{margin-left:741.3px;margin-top:63.25px}.DailyDuration .successMsg[data-v-3e050d8a]{font-size:27px;color:#fff;height:56px;text-align:center;line-height:56px;border-radius:15px;margin-left:695px;display:inline-block}.topBack[data-v-3e050d8a]{position:absolute;font-family:PingFang HK;top:34px;right:49px;font-size:20px;color:#fff;text-align:center;line-height:49px;width:147px;height:49px;background:url("+i("rzRZ")+") 100% 100%}.DailyDuration .toBack[data-v-3e050d8a]{border:3px solid #4dcfff}.Tip[data-v-3e050d8a]{position:absolute;top:260px;left:567px;color:#fff}.tag[data-v-3e050d8a]{font-family:PingFang HK,Medium;font-size:47px;color:#fff;margin-left:631px;margin-top:188px;margin-bottom:46.7px}.setTime[data-v-3e050d8a]{margin-left:677px;font-family:Noto Nastaliq Urdu,Regular;color:#fff;font-size:27px;height:79px;display:-webkit-box;display:-ms-flexbox;display:flex;line-height:79px}.hour-text[data-v-3e050d8a]{width:54px;font-size:27px;margin:4px 14.81px 4px 14.98px}.setTime .hour[data-v-3e050d8a],.setTime .minute[data-v-3e050d8a]{text-align:center;width:66px;height:79px;background:url("+i("F+Ov")+") 100% 100%;border-radius:20px;overflow:hidden}.opacity[data-v-3e050d8a]{opacity:.2}.setTime .hour li[data-v-3e050d8a],.setTime .minute li[data-v-3e050d8a]{height:46px}",""])}});