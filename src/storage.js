import {KEY,createState,validate} from './rules.js';
export function load(){for(const key of [KEY,KEY+'.backup']){try{const text=localStorage.getItem(key);if(text)return {state:validate(JSON.parse(text)),recovered:key.endsWith('backup')}}catch{}}return {state:createState(),recovered:false}}
export function save(state){validate(state);const text=JSON.stringify(state);try{const prev=localStorage.getItem(KEY);if(prev){try{validate(JSON.parse(prev));localStorage.setItem(KEY+'.backup',prev)}catch{}}localStorage.setItem(KEY,text);return true}catch{return false}}
