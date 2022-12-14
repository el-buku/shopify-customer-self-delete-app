APP_FOLDER=$( pwd )
echo "Express server app created at $APP_FOLDER"
npm install

# Configure apache to forward to the express app port
# https://docs.bitnami.com/aws/infrastructure/nodejs/administration/create-custom-application-nodejs/
cd $APP_FOLDER
sudo mkdir -p confz
# make htdocs symlink to public folder
ln -s public htdocs
echo "Include \"$APP_FOLDER/conf/httpd-app.conf\"" > conf/httpd-prefix.conf
echo 'ProxyPass / http://127.0.0.1:3000/
ProxyPassReverse / http://127.0.0.1:3000/' > conf/httpd-app.conf
# edit apache configuration to include the app
echo "Include \"$APP_FOLDER/conf/httpd-prefix.conf\"" > /opt/bitnami/apache2/conf/bitnami/bitnami-apps-prefix.conf
# restart apache
echo "Restarting apache httpd: sudo /opt/bitnami/ctlscript.sh restart apache"
sudo /opt/bitnami/ctlscript.sh restart apache

echo Starting express app with npm start.  Press ctrl-c to stop . . .
echo App can also be started in background with forever start ./bin/www from the app directory
npm start
