import { Cons } from '../component'
import { OptionBuilder } from '../optionBuilder'
import { obtainSlot, } from '../utils'
import type { WatchCallback } from 'vue'
export interface WatchConfig {
    key: string
    handler: WatchCallback,
    flush?: 'post',
    deep?: boolean,
    immediate?: boolean,
}
type Option = Omit<WatchConfig, 'handler' | 'key'>
export function decorator(key: string, option?: Option) {
    return function (proto: any, name: string) {
        const slot = obtainSlot(proto)
        let map = slot.obtainMap<Map<string, WatchConfig | WatchConfig[]>>('watch');
        const opt = Object.assign({}, option ?? {}, {
            key: key,
            handler: proto[name]
        })
        if (map.has(name)) {
            const t = map.get(name)!
            if (Array.isArray(t)) {
                t.push(opt)
            } else {
                map.set(name, [t, opt])
            }
        }
        else {
            map.set(name, opt)
        }
    }
}

export function build(cons: Cons, optionBuilder: OptionBuilder) {
    optionBuilder.watch ??= {}
    const slot = obtainSlot(cons.prototype)
    const names = slot.obtainMap<Map<string, WatchConfig | WatchConfig[]>>('watch')
    if (names) {
        names.forEach((value, name) => {
            const values = Array.isArray(value) ? value : [value]
            values.forEach(v => {
                if (!optionBuilder.watch![v.key]) {
                    optionBuilder.watch![v.key] = v
                } else {
                    const t = optionBuilder.watch![v.key]
                    if (Array.isArray(t)) {
                        t.push(v)
                    } else {
                        optionBuilder.watch![v.key] = [t, v]
                    }
                }
            })
        })
    }

}