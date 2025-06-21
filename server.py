from flask_app import app

from flask_app.controllers.locate_centers import locate
print("Cargado controller de locate", locate ) 


if __name__ == '__main__':
    app.run(debug=True, port=5001)
