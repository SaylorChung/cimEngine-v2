/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.127
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import {
  EllipsoidGeometry_default
} from "./chunk-Q5BHMNKU.js";
import "./chunk-L5SO4Y5V.js";
import "./chunk-Z4SI54EB.js";
import "./chunk-VMVPONIV.js";
import "./chunk-XED3RXKO.js";
import "./chunk-K5G2WELR.js";
import "./chunk-SLIA3GQP.js";
import "./chunk-XDHM4G3P.js";
import "./chunk-DYJHEP3B.js";
import "./chunk-TU6ZXHVU.js";
import "./chunk-EZNAJPP5.js";
import "./chunk-5S2B46UQ.js";
import "./chunk-GK4QU6QI.js";
import "./chunk-QZKN2RXM.js";
import "./chunk-2AVIUB5H.js";
import {
  defined_default
} from "./chunk-7ITUZTFH.js";

// packages/engine/Source/Workers/createEllipsoidGeometry.js
function createEllipsoidGeometry(ellipsoidGeometry, offset) {
  if (defined_default(offset)) {
    ellipsoidGeometry = EllipsoidGeometry_default.unpack(ellipsoidGeometry, offset);
  }
  return EllipsoidGeometry_default.createGeometry(ellipsoidGeometry);
}
var createEllipsoidGeometry_default = createEllipsoidGeometry;
export {
  createEllipsoidGeometry_default as default
};
