# Rancher Values

  drupalHashSalt: "{{ salt }}"
  
  # Domene som brukes:
  ingress:
    hostname: "{{ sections.rancher.domain }}"
  
    enabled: true
    tls: true
    annotations:
      kubernetes.io/ingress.class: nginx
      cert-manager.io/cluster-issuer: letsencrypt-staging
      nginx.ingress.kubernetes.io/proxy-body-size: 50m
  
  # Docker-pakken som skal kjøres:
  image:
    repository: "bouvet/{{ machine_name }}_main"
    tag: "latest"`;