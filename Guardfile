# A sample Guardfile
# More info at https://github.com/guard/guard#readme


guard 'livereload' do
  watch(%r{client/.+\.(css|js|html)})
  # Rails Assets Pipeline
  watch(%r{(app|vendor)(/assets/\w+/(.+\.(css|js|html|png|jpg))).*}) { |m| "/assets/#{m[3]}" }
end