import { Cons } from '../component'
import { OptionBuilder, applyAccessors } from '../optionBuilder'
import { obtainSlot, optoinNullableMemberDecorator } from '../utils'

export const decorator = optoinNullableMemberDecorator(function (proto: any, name: string, option?: {}) {
    const slot = obtainSlot(proto)
    let map = slot.obtainMap<Map<string, any>>('ref')
    map.set(name, true)
})


export function build(cons: Cons, optionBuilder: OptionBuilder) {
    const slot = obtainSlot(cons.prototype)
    const names = slot.obtainMap<Map<string, any>>('ref')!
    if (names) {
        applyAccessors(optionBuilder, (ctx: any) => {
            const data: Map<string, { get: () => any, set: undefined }> = new Map
            names.forEach((value, name) => {
                data.set(name, {
                    get: function (this: any) {
                        return ctx.$refs[name]
                    },
                    set: undefined
                })
            })
            return data
        })
    }
}