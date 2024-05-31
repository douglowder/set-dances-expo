import ExpoModulesCore

public class ExpoAirplayButtonViewModule: Module {

  public func definition() -> ModuleDefinition {
    Name("ExpoAirplayButtonView")
    View(ExpoAirplayButtonView.self) {
      Prop("tintColor") { (view: ExpoAirplayButtonView, tintColor: UIColor?) in
        if tintColor != nil && view.avRoutePickerView.tintColor != tintColor {
          view.avRoutePickerView.tintColor = tintColor
        }
      }
      Prop("activeTintColor") { (view: ExpoAirplayButtonView, activeTintColor: UIColor?) in
        if activeTintColor != nil && view.avRoutePickerView.activeTintColor != activeTintColor {
          view.avRoutePickerView.activeTintColor = activeTintColor
        }
      }
      Prop("prioritizesVideoDevices") { (view:ExpoAirplayButtonView, prioritizesVideoDevices: Bool?) in
        if (prioritizesVideoDevices != nil && view.avRoutePickerView.prioritizesVideoDevices != prioritizesVideoDevices) {
          view.avRoutePickerView.prioritizesVideoDevices = prioritizesVideoDevices ?? false
        }
      }
    }
  }
}
