import Foundation
import UIKit

@objc(DeviceInfoModule)
class DeviceInfoModule: NSObject {
  
  @objc
  func getOSVersion(_ callback: RCTResponseSenderBlock) {
    let osVersion = UIDevice.current.systemVersion
    callback([NSNull(), osVersion])
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
} 