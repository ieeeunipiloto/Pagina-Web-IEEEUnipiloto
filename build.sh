#!/usr/bin/env bash
set -o errexit

pip install --upgrade pip
pip install --upgrade setuptools wheel
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
