import ExpoModulesCore
import AVKit

// This view will be used as a native component. Make sure to inherit from `ExpoView`
// to apply the proper styling (e.g. border radius and shadows).
class ExpoAirplayButtonView: ExpoView {
  public let avRoutePickerView = AVRoutePickerView()

    required init(appContext: AppContext? = nil) {
      super.init(appContext: appContext)
      clipsToBounds = true
      avRoutePickerView.tintColor = UIColor(red: 1.0, green: 1.0, blue: 1.0, alpha: 1.0) // white
      avRoutePickerView.activeTintColor = UIColor(red: 0.0, green: 1.0, blue: 1.0, alpha: 1.0) // green-blue
      avRoutePickerView.backgroundColor = UIColor(red: 1.0, green: 1.0, blue: 1.0, alpha: 0.0) // transparent
      avRoutePickerView.showsLargeContentViewer = true
      addSubview(avRoutePickerView)
      avRoutePickerView.autoresizingMask = [
        .flexibleWidth,
        .flexibleHeight,
      ]
    }

  func setConstraints() {
    var constX:NSLayoutConstraint = NSLayoutConstraint(item: avRoutePickerView, attribute: NSLayoutConstraint.Attribute.centerX, relatedBy: NSLayoutConstraint.Relation.equal, toItem: self, attribute: NSLayoutConstraint.Attribute.centerX, multiplier: 1, constant: 0);
    self.addConstraint(constX);

    var constY:NSLayoutConstraint = NSLayoutConstraint(item: avRoutePickerView, attribute: NSLayoutConstraint.Attribute.centerY, relatedBy: NSLayoutConstraint.Relation.equal, toItem: self, attribute: NSLayoutConstraint.Attribute.centerY, multiplier: 1, constant: 0);
    self.addConstraint(constY);

    var constW:NSLayoutConstraint = NSLayoutConstraint(item: avRoutePickerView, attribute: NSLayoutConstraint.Attribute.width, relatedBy: NSLayoutConstraint.Relation.equal, toItem: self, attribute: NSLayoutConstraint.Attribute.width, multiplier: 1, constant: 0);
    self.addConstraint(constW);

    var constH:NSLayoutConstraint = NSLayoutConstraint(item: avRoutePickerView, attribute: NSLayoutConstraint.Attribute.height, relatedBy: NSLayoutConstraint.Relation.equal, toItem: self, attribute: NSLayoutConstraint.Attribute.height, multiplier: 1, constant: 0);
    self.addConstraint(constH);

  }
}
