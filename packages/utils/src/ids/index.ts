import hat from 'hat'

export interface IdsProps {
  bits?: number
  base?: number
  expandBy?: number
}

class Ids {
  private bits?: number
  private base?: number
  private expandBy?: number

  private seed: any

  constructor(props?: IdsProps) {
    if (props) {
      props.bits && (this.bits = props.bits)
      props.base && (this.base = props.base)
      props.expandBy && (this.expandBy = props.expandBy)
    }
    this.seed = hat.rack(this.bits, this.base, this.expandBy)
  }

  public next(element?: Record<any, any>): string {
    return this.seed(element || true)
  }

  public assigned(id: string): boolean {
    return this.seed.get(id) || false
  }

  public claim(id: string, element?: Record<any, any>) {
    this.seed.set(id, element)
  }

  public unclaim(id: string) {
    this.seed.hats[id]
  }

  public nextPrefixed(prefix: string, element?: Record<any, any>): string {
    let id

    do {
      id = prefix + this.next()
    } while (this.assigned(id))

    // claim {prefix}{random}
    this.claim(id, element)

    // return
    return id
  }

  public clear() {
    for (const id in this.seed.hats) {
      this.unclaim(id)
    }
  }
}

export default Ids
