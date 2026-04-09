import { MAT_RIPPLE_GLOBAL_OPTIONS, RippleGlobalOptions } from '@angular/material/core'

export const disableRipples = () => {
  const globalRippleConfig: RippleGlobalOptions = { disabled: true }
  return { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig }
}
