# #!/usr/bin/env python3
# """
# Robot Map Transfer Server
# Handles sending map configurations to robot via SSH
# """

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import paramiko
# import os
# import tempfile
# from werkzeug.utils import secure_filename
# import logging
# from datetime import datetime

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Configuration
# ROBOT_IP = "192.163.2.46"
# ROBOT_USER = "taikisha"
# ROBOT_PASSWORD = "12345"
# ROBOT_MAP_PATH = "/home/taikisha/shopfloortag_json"

# # Ensure local temp directory exists
# TEMP_DIR = tempfile.mkdtemp()

# def create_ssh_client():
#     """Create SSH client connection to robot"""
#     try:
#         client = paramiko.SSHClient()
#         client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
#         client.connect(
#             hostname=ROBOT_IP,
#             username=ROBOT_USER,
#             password=ROBOT_PASSWORD,
#             timeout=10
#         )
#         return client
#     except Exception as e:
#         logger.error(f"SSH connection failed: {e}")
#         raise

# def ensure_remote_directory(sftp, path):
#     """Ensure remote directory exists"""
#     try:
#         sftp.stat(path)
#     except FileNotFoundError:
#         # Create directory and any missing parent directories
#         current_path = ""
#         for part in path.split('/'):
#             if not part:
#                 continue
#             current_path += '/' + part
#             try:
#                 sftp.stat(current_path)
#             except FileNotFoundError:
#                 sftp.mkdir(current_path)

# @app.route('/send-json-to-robot', methods=['POST'])
# def send_json_to_robot():
#     """
#     Receive JSON file and send to robot via SSH
#     Expected form data:
#         - mapName: name of the map
#         - json: JSON file
#     """
#     try:
#         # Check if file is present
#         if 'json' not in request.files:
#             return jsonify({'error': 'No JSON file provided'}), 400
        
#         map_name = request.form.get('mapName', 'default_map')
#         json_file = request.files['json']
        
#         if json_file.filename == '':
#             return jsonify({'error': 'Empty filename'}), 400
        
#         # Secure the filename
#         filename = secure_filename(json_file.filename)
        
#         # Save temporarily
#         temp_path = os.path.join(TEMP_DIR, filename)
#         json_file.save(temp_path)
        
#         logger.info(f"Received JSON file: {filename} for map: {map_name}")
        
#         # Create SSH connection
#         ssh = create_ssh_client()
#         sftp = ssh.open_sftp()
        
#         try:
#             # Ensure remote directory exists
#             ensure_remote_directory(sftp, ROBOT_MAP_PATH)
            
#             # Define remote path
#             remote_filename = f"{map_name}_config.json"
#             remote_path = os.path.join(ROBOT_MAP_PATH, remote_filename)
            
#             # Upload file
#             sftp.put(temp_path, remote_path)
#             logger.info(f"Successfully uploaded to {remote_path}")
            
#             # Also create a timestamped backup
#             timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
#             backup_filename = f"{map_name}_config_{timestamp}.json"
#             backup_path = os.path.join(ROBOT_MAP_PATH, "backups", backup_filename)
            
#             try:
#                 ensure_remote_directory(sftp, os.path.join(ROBOT_MAP_PATH, "backups"))
#                 sftp.put(temp_path, backup_path)
#                 logger.info(f"Created backup at {backup_path}")
#             except Exception as e:
#                 logger.warning(f"Could not create backup: {e}")
            
#             # Get file info for response
#             file_stats = sftp.stat(remote_path)
            
#             return jsonify({
#                 'status': 'success',
#                 'message': 'JSON sent successfully to robot',
#                 'remote_path': remote_path,
#                 'files': [remote_filename],
#                 'file_size': file_stats.st_size,
#                 'map_name': map_name
#             }), 200
            
#         finally:
#             sftp.close()
#             ssh.close()
#             # Clean up temp file
#             os.remove(temp_path)
            
#     except paramiko.AuthenticationException:
#         logger.error("SSH authentication failed")
#         return jsonify({'error': 'SSH authentication failed. Check username and password.'}), 500
#     except paramiko.SSHException as e:
#         logger.error(f"SSH connection error: {e}")
#         return jsonify({'error': f'SSH connection error: {str(e)}'}), 500
#     except Exception as e:
#         logger.error(f"Error sending JSON to robot: {e}")
#         return jsonify({'error': str(e)}), 500

# @app.route('/send-map-to-robot', methods=['POST'])
# def send_map_to_robot():
#     """
#     Receive map files and send to robot via SSH
#     Expected form data:
#         - mapName: name of the map
#         - png: PNG file
#         - yaml: YAML file
#     """
#     try:
#         # Check if files are present
#         if 'png' not in request.files or 'yaml' not in request.files:
#             return jsonify({'error': 'Missing map files'}), 400
        
#         map_name = request.form.get('mapName', 'default_map')
#         png_file = request.files['png']
#         yaml_file = request.files['yaml']
        
#         if png_file.filename == '' or yaml_file.filename == '':
#             return jsonify({'error': 'Empty filename'}), 400
        
#         # Secure filenames
#         png_filename = secure_filename(png_file.filename)
#         yaml_filename = secure_filename(yaml_file.filename)
        
#         # Save temporarily
#         temp_png = os.path.join(TEMP_DIR, png_filename)
#         temp_yaml = os.path.join(TEMP_DIR, yaml_filename)
#         png_file.save(temp_png)
#         yaml_file.save(temp_yaml)
        
#         logger.info(f"Received map files for: {map_name}")
        
#         # Create SSH connection
#         ssh = create_ssh_client()
#         sftp = ssh.open_sftp()
        
#         try:
#             # Ensure remote directory exists
#             ensure_remote_directory(sftp, ROBOT_MAP_PATH)
            
#             # Define remote paths
#             remote_png = os.path.join(ROBOT_MAP_PATH, f"{map_name}.png")
#             remote_yaml = os.path.join(ROBOT_MAP_PATH, f"{map_name}.yaml")
            
#             # Upload files
#             sftp.put(temp_png, remote_png)
#             sftp.put(temp_yaml, remote_yaml)
            
#             logger.info(f"Successfully uploaded map to {ROBOT_MAP_PATH}")
            
#             return jsonify({
#                 'status': 'success',
#                 'message': 'Map sent successfully to robot',
#                 'remote_path': ROBOT_MAP_PATH,
#                 'files': [f"{map_name}.png", f"{map_name}.yaml"],
#                 'map_name': map_name
#             }), 200
            
#         finally:
#             sftp.close()
#             ssh.close()
#             # Clean up temp files
#             os.remove(temp_png)
#             os.remove(temp_yaml)
            
#     except paramiko.AuthenticationException:
#         logger.error("SSH authentication failed")
#         return jsonify({'error': 'SSH authentication failed. Check username and password.'}), 500
#     except paramiko.SSHException as e:
#         logger.error(f"SSH connection error: {e}")
#         return jsonify({'error': f'SSH connection error: {str(e)}'}), 500
#     except Exception as e:
#         logger.error(f"Error sending map to robot: {e}")
#         return jsonify({'error': str(e)}), 500

# @app.route('/list-robot-maps', methods=['GET'])
# def list_robot_maps():
#     """List all map files on the robot"""
#     try:
#         ssh = create_ssh_client()
#         sftp = ssh.open_sftp()
        
#         try:
#             files = []
#             try:
#                 for item in sftp.listdir(ROBOT_MAP_PATH):
#                     item_path = os.path.join(ROBOT_MAP_PATH, item)
#                     try:
#                         stats = sftp.stat(item_path)
#                         files.append({
#                             'name': item,
#                             'size': stats.st_size,
#                             'modified': stats.st_mtime
#                         })
#                     except:
#                         continue
#             except FileNotFoundError:
#                 return jsonify({'files': []}), 200
            
#             return jsonify({
#                 'status': 'success',
#                 'files': files
#             }), 200
            
#         finally:
#             sftp.close()
#             ssh.close()
            
#     except Exception as e:
#         logger.error(f"Error listing robot maps: {e}")
#         return jsonify({'error': str(e)}), 500

# @app.route('/test-ssh-connection', methods=['GET'])
# def test_ssh_connection():
#     """Test SSH connection to robot"""
#     try:
#         ssh = create_ssh_client()
#         ssh.close()
#         return jsonify({
#             'status': 'success',
#             'message': f'Successfully connected to {ROBOT_IP}'
#         }), 200
#     except Exception as e:
#         return jsonify({
#             'status': 'error',
#             'message': str(e)
#         }), 500

# if __name__ == '__main__':
#     print(f"🚀 Robot Map Transfer Server")
#     print(f"📡 Target Robot: {ROBOT_USER}@{ROBOT_IP}")
#     print(f"📁 Target Path: {ROBOT_MAP_PATH}")
#     print(f"📍 Local Temp Dir: {TEMP_DIR}")
#     print("\nStarting server on http://localhost:5000")
#     app.run(host='0.0.0.0', port=5000, debug=True)



#!/usr/bin/env python3
"""
Robot Map Transfer Server
Handles sending map configurations to robot via SSH
Supports dynamic robot IP configuration from frontend
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import paramiko
import os
import tempfile
from werkzeug.utils import secure_filename
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Default configuration (can be overridden per request)
DEFAULT_ROBOT_USER = "taikisha"
DEFAULT_ROBOT_PASSWORD = "12345"
DEFAULT_ROBOT_MAP_PATH = "/home/taikisha/shopfloortag_json"

TEMP_DIR = tempfile.mkdtemp()


def create_ssh_client(hostname, username, password):
    """Create SSH client connection to robot with given credentials"""
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(
            hostname=hostname,
            username=username,
            password=password,
            timeout=10
        )
        return client
    except Exception as e:
        logger.error(f"SSH connection failed to {hostname}: {e}")
        raise


def ensure_remote_directory(sftp, path):
    """Ensure remote directory exists, creating parents as needed"""
    try:
        sftp.stat(path)
    except FileNotFoundError:
        current_path = ""
        for part in path.split('/'):
            if not part:
                continue
            current_path += '/' + part
            try:
                sftp.stat(current_path)
            except FileNotFoundError:
                sftp.mkdir(current_path)


# ─────────────────────────────────────────────
# WIFI / CONNECTION STATUS
# ─────────────────────────────────────────────

@app.route('/wifi-details', methods=['GET'])
def wifi_details():
    """Return robot network/wifi details. Always returns 200 so frontend handles state gracefully."""
    robot_ip = request.args.get('robotIp', '192.163.2.39')
    robot_user = request.args.get('robotUser', DEFAULT_ROBOT_USER)
    robot_password = request.args.get('robotPassword', DEFAULT_ROBOT_PASSWORD)
    
    try:
        ssh = create_ssh_client(robot_ip, robot_user, robot_password)
        try:
            stdin, stdout, stderr = ssh.exec_command(
                "iwconfig 2>/dev/null | grep -E 'ESSID|Signal level|Bit Rate' | head -10"
            )
            wifi_output = stdout.read().decode().strip()

            stdin2, stdout2, stderr2 = ssh.exec_command("hostname -I 2>/dev/null | awk '{print $1}'")
            ip_output = stdout2.read().decode().strip()
        finally:
            ssh.close()

        return jsonify({
            'status': 'connected',
            'robot_ip': robot_ip,
            'robot_hostname_ip': ip_output,
            'wifi_info': wifi_output or 'No wifi info available'
        }), 200

    except Exception as e:
        logger.warning(f"wifi-details: robot {robot_ip} unreachable — {e}")
        return jsonify({
            'status': 'disconnected',
            'robot_ip': robot_ip,
            'wifi_info': None,
            'error': str(e)
        }), 200


# ─────────────────────────────────────────────
# TEST SSH
# ─────────────────────────────────────────────

@app.route('/test-ssh-connection', methods=['POST'])
def test_ssh_connection():
    """Test SSH connection to robot with provided IP"""
    data = request.get_json() or {}
    robot_ip = data.get('robotIp', '192.163.2.39')
    robot_user = data.get('robotUser', DEFAULT_ROBOT_USER)
    robot_password = data.get('robotPassword', DEFAULT_ROBOT_PASSWORD)
    
    try:
        ssh = create_ssh_client(robot_ip, robot_user, robot_password)
        ssh.close()
        return jsonify({
            'status': 'success',
            'message': f'Successfully connected to {robot_ip}'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500


# ─────────────────────────────────────────────
# SEND YAML TO ROBOT (for Map Editor)
# ─────────────────────────────────────────────

@app.route('/send-yaml-to-robot', methods=['POST'])
def send_yaml_to_robot():
    """
    Receive YAML content and send to robot via SSH.
    Form data: mapName (str), yaml (file), robotIp (str), robotUser (str), robotPassword (str)
    """
    temp_yaml = None
    try:
        # Get YAML file from form data
        if 'yaml' not in request.files:
            return jsonify({'error': 'No YAML file provided'}), 400

        map_name = request.form.get('mapName', 'default_map')
        robot_ip = request.form.get('robotIp', '192.163.2.39')
        robot_user = request.form.get('robotUser', DEFAULT_ROBOT_USER)
        robot_password = request.form.get('robotPassword', DEFAULT_ROBOT_PASSWORD)
        robot_map_path = request.form.get('robotMapPath', DEFAULT_ROBOT_MAP_PATH)
        
        yaml_file = request.files['yaml']

        if yaml_file.filename == '':
            return jsonify({'error': 'Empty filename'}), 400

        # Read YAML content
        yaml_content = yaml_file.read().decode('utf-8')
        
        # Validate YAML content has waypoints
        if 'waypoints:' not in yaml_content:
            return jsonify({'error': 'Invalid YAML format: missing waypoints section'}), 400

        # Save to temporary file
        filename = secure_filename(yaml_file.filename)
        temp_yaml = os.path.join(TEMP_DIR, filename)
        with open(temp_yaml, 'w', encoding='utf-8') as f:
            f.write(yaml_content)

        # Count waypoints for logging
        waypoints_count = yaml_content.count('  - x:')
        logger.info(f"Received YAML for map: {map_name}, waypoints: {waypoints_count}, size: {len(yaml_content)} bytes")
        logger.info(f"Target robot: {robot_user}@{robot_ip}")

        # Connect to robot
        ssh = create_ssh_client(robot_ip, robot_user, robot_password)
        sftp = ssh.open_sftp()

        try:
            ensure_remote_directory(sftp, robot_map_path)

            remote_filename = f"{map_name}.yaml"
            remote_path = os.path.join(robot_map_path, remote_filename)
            sftp.put(temp_yaml, remote_path)
            logger.info(f"Uploaded YAML to {remote_path}")

            # Also save as try.yaml if specified
            try_yaml = os.path.join(robot_map_path, "try.yaml")
            sftp.put(temp_yaml, try_yaml)
            logger.info(f"Also saved as {try_yaml}")

            # Create timestamped backup
            try:
                backup_dir = os.path.join(robot_map_path, "backups")
                ensure_remote_directory(sftp, backup_dir)
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                backup_path = os.path.join(backup_dir, f"{map_name}_{timestamp}.yaml")
                sftp.put(temp_yaml, backup_path)
                logger.info(f"Backup created at {backup_path}")
            except Exception as e:
                logger.warning(f"Backup failed (non-fatal): {e}")

            file_stats = sftp.stat(remote_path)

            return jsonify({
                'status': 'success',
                'message': 'YAML configuration sent successfully',
                'remote_path': remote_path,
                'map_name': map_name,
                'file_size': file_stats.st_size,
                'waypoints_count': waypoints_count,
                'robot_ip': robot_ip
            }), 200

        finally:
            sftp.close()
            ssh.close()

    except paramiko.AuthenticationException:
        logger.error("SSH authentication failed")
        return jsonify({'error': 'SSH authentication failed. Check username and password.'}), 500
    except paramiko.SSHException as e:
        logger.error(f"SSH error: {e}")
        return jsonify({'error': f'SSH connection error: {str(e)}'}), 500
    except Exception as e:
        logger.error(f"Error sending YAML: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if temp_yaml and os.path.exists(temp_yaml):
            os.remove(temp_yaml)


# ─────────────────────────────────────────────
# SEND JSON TO ROBOT
# ─────────────────────────────────────────────

@app.route('/send-json-to-robot', methods=['POST'])
def send_json_to_robot():
    """
    Receive JSON file and send to robot via SSH.
    Form data: mapName (str), json (file), robotIp (str), robotUser (str), robotPassword (str)
    """
    temp_path = None
    try:
        if 'json' not in request.files:
            return jsonify({'error': 'No JSON file provided'}), 400

        map_name = request.form.get('mapName', 'default_map')
        robot_ip = request.form.get('robotIp', '192.163.2.39')
        robot_user = request.form.get('robotUser', DEFAULT_ROBOT_USER)
        robot_password = request.form.get('robotPassword', DEFAULT_ROBOT_PASSWORD)
        robot_map_path = request.form.get('robotMapPath', DEFAULT_ROBOT_MAP_PATH)
        
        json_file = request.files['json']

        if json_file.filename == '':
            return jsonify({'error': 'Empty filename'}), 400

        filename = secure_filename(json_file.filename)
        temp_path = os.path.join(TEMP_DIR, filename)
        json_file.save(temp_path)

        logger.info(f"Received JSON: {filename} for map: {map_name}")
        logger.info(f"Target robot: {robot_user}@{robot_ip}")

        ssh = create_ssh_client(robot_ip, robot_user, robot_password)
        sftp = ssh.open_sftp()

        try:
            ensure_remote_directory(sftp, robot_map_path)

            remote_filename = f"{map_name}.json"
            remote_path = os.path.join(robot_map_path, remote_filename)
            sftp.put(temp_path, remote_path)
            logger.info(f"Uploaded to {remote_path}")

            # Timestamped backup
            try:
                backup_dir = os.path.join(robot_map_path, "backups")
                ensure_remote_directory(sftp, backup_dir)
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                backup_path = os.path.join(backup_dir, f"{map_name}_{timestamp}.json")
                sftp.put(temp_path, backup_path)
                logger.info(f"Backup created at {backup_path}")
            except Exception as e:
                logger.warning(f"Backup failed (non-fatal): {e}")

            file_stats = sftp.stat(remote_path)

            return jsonify({
                'status': 'success',
                'message': 'JSON sent successfully to robot',
                'remote_path': remote_path,
                'file': remote_filename,
                'file_size': file_stats.st_size,
                'map_name': map_name,
                'robot_ip': robot_ip
            }), 200

        finally:
            sftp.close()
            ssh.close()

    except paramiko.AuthenticationException:
        logger.error("SSH authentication failed")
        return jsonify({'error': 'SSH authentication failed. Check username and password.'}), 500
    except paramiko.SSHException as e:
        logger.error(f"SSH error: {e}")
        return jsonify({'error': f'SSH connection error: {str(e)}'}), 500
    except Exception as e:
        logger.error(f"Error sending JSON: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)


# ─────────────────────────────────────────────
# SEND MAP FILES (PNG + YAML) TO ROBOT
# ─────────────────────────────────────────────

@app.route('/send-map-to-robot', methods=['POST'])
def send_map_to_robot():
    """
    Receive PNG + YAML map files and send to robot via SSH.
    Form data: mapName (str), png (file), yaml (file), robotIp (str), robotUser (str), robotPassword (str)
    """
    temp_png = None
    temp_yaml = None
    try:
        if 'png' not in request.files or 'yaml' not in request.files:
            return jsonify({'error': 'Missing map files (need png and yaml)'}), 400

        map_name = request.form.get('mapName', 'default_map')
        robot_ip = request.form.get('robotIp', '192.163.2.39')
        robot_user = request.form.get('robotUser', DEFAULT_ROBOT_USER)
        robot_password = request.form.get('robotPassword', DEFAULT_ROBOT_PASSWORD)
        robot_map_path = request.form.get('robotMapPath', DEFAULT_ROBOT_MAP_PATH)
        
        png_file = request.files['png']
        yaml_file = request.files['yaml']

        if png_file.filename == '' or yaml_file.filename == '':
            return jsonify({'error': 'Empty filename'}), 400

        temp_png = os.path.join(TEMP_DIR, secure_filename(png_file.filename))
        temp_yaml = os.path.join(TEMP_DIR, secure_filename(yaml_file.filename))
        png_file.save(temp_png)
        yaml_file.save(temp_yaml)

        logger.info(f"Received map files for: {map_name}")
        logger.info(f"Target robot: {robot_user}@{robot_ip}")

        ssh = create_ssh_client(robot_ip, robot_user, robot_password)
        sftp = ssh.open_sftp()

        try:
            ensure_remote_directory(sftp, robot_map_path)

            remote_png = os.path.join(robot_map_path, f"{map_name}.png")
            remote_yaml = os.path.join(robot_map_path, f"{map_name}.yaml")
            sftp.put(temp_png, remote_png)
            sftp.put(temp_yaml, remote_yaml)

            logger.info(f"Map uploaded to {robot_map_path}")

            return jsonify({
                'status': 'success',
                'message': 'Map sent successfully to robot',
                'remote_path': robot_map_path,
                'files': [f"{map_name}.png", f"{map_name}.yaml"],
                'map_name': map_name,
                'robot_ip': robot_ip
            }), 200

        finally:
            sftp.close()
            ssh.close()

    except paramiko.AuthenticationException:
        logger.error("SSH authentication failed")
        return jsonify({'error': 'SSH authentication failed. Check username and password.'}), 500
    except paramiko.SSHException as e:
        logger.error(f"SSH error: {e}")
        return jsonify({'error': f'SSH connection error: {str(e)}'}), 500
    except Exception as e:
        logger.error(f"Error sending map: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        for f in [temp_png, temp_yaml]:
            if f and os.path.exists(f):
                os.remove(f)


# ─────────────────────────────────────────────
# LIST ROBOT MAPS
# ─────────────────────────────────────────────

@app.route('/list-robot-maps', methods=['POST'])
def list_robot_maps():
    """List all files in robot map directory"""
    data = request.get_json() or {}
    robot_ip = data.get('robotIp', '192.163.2.39')
    robot_user = data.get('robotUser', DEFAULT_ROBOT_USER)
    robot_password = data.get('robotPassword', DEFAULT_ROBOT_PASSWORD)
    robot_map_path = data.get('robotMapPath', DEFAULT_ROBOT_MAP_PATH)
    
    try:
        ssh = create_ssh_client(robot_ip, robot_user, robot_password)
        sftp = ssh.open_sftp()

        try:
            files = []
            try:
                for item in sftp.listdir(robot_map_path):
                    item_path = os.path.join(robot_map_path, item)
                    try:
                        stats = sftp.stat(item_path)
                        files.append({
                            'name': item,
                            'size': stats.st_size,
                            'modified': stats.st_mtime
                        })
                    except Exception:
                        continue
            except FileNotFoundError:
                return jsonify({'status': 'success', 'files': []}), 200

            return jsonify({
                'status': 'success',
                'files': files
            }), 200

        finally:
            sftp.close()
            ssh.close()

    except Exception as e:
        logger.error(f"Error listing robot maps: {e}")
        return jsonify({'error': str(e)}), 500


# ─────────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────────

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'temp_dir': TEMP_DIR,
        'timestamp': datetime.now().isoformat()
    }), 200


# ─────────────────────────────────────────────
# ENTRY POINT
# ─────────────────────────────────────────────

if __name__ == '__main__':
    print("🚀 Robot Map Transfer Server")
    print(f"📍 Local Temp Directory: {TEMP_DIR}")
    print(f"📁 Default Map Path: {DEFAULT_ROBOT_MAP_PATH}")
    print("\nStarting server on http://localhost:5000")
    print("Note: Robot IP can be specified per request via form data")
    print("\n📡 Available endpoints:")
    print("   POST /send-yaml-to-robot     - Send YAML waypoints")
    print("   POST /send-json-to-robot     - Send JSON waypoints")
    print("   POST /send-map-to-robot      - Send PNG+YAML map files")
    print("   POST /list-robot-maps        - List all files")
    print("   POST /test-ssh-connection    - Test SSH connection")
    print("   GET  /wifi-details           - Get WiFi status")
    print("   GET  /health                 - Health check")
    app.run(host='0.0.0.0', port=5000, debug=True)