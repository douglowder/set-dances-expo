source 'https://rubygems.org'

# Used by `expo run:ios` / `expo prebuild` for both apps: Expo CLI finds this
# Gemfile by walking up from the app directory and runs `bundle exec pod`.
gem 'cocoapods', '1.17.0'

# json 3.x removed the `quirks_mode` option that ActiveSupport 7.2 (a CocoaPods
# dependency) still passes, which makes `pod install` fail with
# "ArgumentError - unknown keyword: quirks_mode".
gem 'json', '2.21.2'
