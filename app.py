from flask_bootstrap import Bootstrap
from flask import Flask, request, render_template, url_for, json, flash, jsonify, session, redirect

app = Flask(__name__)
bootstrap = Bootstrap(app)




@app.route('/', methods=['GET','POST'])
def index():
    return render_template('index.html')

@app.route('/gest_usuarios_roles', methods=['GET'])
def gest_usuarios_roles():
    return render_template('gest_usuarios_roles.html')

@app.route('/gestor_ventas', methods=['GET'])
def gestor_ventas():
    return render_template('gestor_ventas.html')

if __name__ == '__main__':
    # if ENV == 'prod':
    #     app.run(ssl_context="adhoc", host='0.0.0.0', port=80)

    app.run(debug=True, port=5000)