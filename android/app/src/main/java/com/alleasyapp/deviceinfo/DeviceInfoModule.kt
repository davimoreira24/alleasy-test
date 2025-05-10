package com.alleasyapp.deviceinfo

import android.os.Build
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class DeviceInfoModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "DeviceInfoModule"
    }

    @ReactMethod
    fun getManufacturer(callback: Callback) {
        try {
            val manufacturer = Build.MANUFACTURER
            callback.invoke(null, manufacturer)
        } catch (e: Exception) {
            callback.invoke(e.toString(), null)
        }
    }
} 